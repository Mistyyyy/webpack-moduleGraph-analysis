import React, { memo }from 'react';
import Graphin from "@antv/graphin";

export default memo(({ data }) => {
  return <Graphin data={data} />
})
