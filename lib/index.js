const viewer = require('../server/viewer.js');
const { setNodes, setEdges } = require('../server/data.js');

module.exports = class ModuleGraphAnalysis {
  constructor({
    host = '127.0.0.1',
    port = 8000,
  } = {}) {
    this.host = host,
    this.port = port,
    this.context = process.cwd();
  }

  render() {
    viewer({
      host: this.host,
      port: this.port,
    })
  }

  unique(array, func) {
    return array.reduce((prev, curr) => {
      if (prev.some(item => func(item, curr))) return prev;
      prev.push(curr)
      return prev;
    }, [])
    return this.toArray(new Set(array));
  }

  toArray(iterator) {
    if (iterator === undefined) return []
    return Array.from(iterator)
  }

  getPath(path) {
    if (!path) return
    if (path.startsWith(this.context))
      return path.slice(this.context.length);
    return path;
  }

  getParentModule(connection) {
    if (connection) return connection.originModule
    return null;
  }

  getChildModule(connection) {
    if (connection) return connection.module
    return null;
  }

  getSource(connection, type) {
    if (connection) {
      if (type === 'raw')
        return this.getPath(connection.module.rawRequest)
      return this.getPath(connection.module.request)
    }
    return 'Webpack Process'
  }


  getTarget(connection, type) {
    if (connection) {
      if (connection.originModule) {
        if (type === 'raw') return this.getPath(connection.originModule.rawRequest)
        return this.getPath(connection.originModule.request)
      }
    }
    return 'Webpack Process'
  }

  getEdges(mgds) {
    return this.unique(
      mgds.map(mgd => {
        const { connection } = mgd;
        if (connection === undefined) return null
        return {
          source: this.getSource(connection, 'raw'),
          rawSource: this.getSource(connection, 'full'),
          target: this.getTarget(connection, 'raw'),
          rawTarget: this.getTarget(connection, 'full'),
          data: {
            ...connection,
            source: this.getSource(connection, 'raw'),
            target: this.getTarget(connection, 'raw'),
          }
        }
      }).filter(Boolean),
      ({ rawSource, rawTarget }, { rawSource: rs, rawTarget: rt }) => {
        return rawSource === rs && rawTarget === rt
      }
    )
  }

  getParentNode({ outgoingConnections, async }) {
    return this.toArray(outgoingConnections)
      .map(connection => {
        return {
          id: this.getSource(connection, 'raw'),
          fullId: this.getSource(connection, 'full'),
          shape: 'CircleNode',
          data: {
            ...this.getParentModule(connection),
            id: this.getSource(connection, 'raw'),
            label: this.getSource(connection, 'full'),
          }
        }
      })
  }

  getChildNode({ incomingConnections, async }) {
    return this.toArray(incomingConnections)
      .map(connection => {
        return {
          id: this.getTarget(connection, 'raw'),
          fullId: this.getTarget(connection, 'full'),
          shape: 'CircleNode',
          data: {
            ...this.getChildModule(connection),
            id: this.getTarget(connection, 'raw'),
            label: this.getTarget(connection, 'full'),
          }
        }
      })
  }

  getNodes(mgms) {
    return this.unique(
      mgms.reduce((prev, mgm) => {
        const parentNode = this.getParentNode(mgm)
        const childNode = this.getChildNode(mgm)
        return [...prev, ...parentNode, ...childNode]
      }, []),
      ({ id }, { id: ids }) => id === ids
    )
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('ModuleGraphAnalysis', compilation => {
      compilation.hooks.finishModules.tapAsync('ModuleGraphAnalysis', (module, callback) => {
        const { moduleGraph } = compilation;
        this.moduleGraph = moduleGraph;
        const mgms = this.toArray(moduleGraph._moduleMap.values());
        const mgds = this.toArray(moduleGraph._dependencyMap.values())
        const nodes = this.getNodes(mgms);
        const edges = this.getEdges(mgds);
        setNodes(nodes);
        setEdges(edges);
        this.nodes = nodes;
        this.edges = edges;
        callback()
      })
    })

    compiler.hooks.done.tapAsync('ModuleGraphAnalysis', (stats, callback) => {
      this.render()
      callback()
    })
  }
}
