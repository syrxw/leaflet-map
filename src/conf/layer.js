export default {
    type: {
        WMS: "wms",
        WFS: "wfs"
    },
    layer: {
        Baidu: {
            vec: {
                func: "addBaiduBaseLayer"
            },
            img: {
                func: "addBaiduBaseLayer"
            },
            img_0: {
                func: "addBaiduBaseLayer"
            },
            customId: {
                func: "addBaiduCustomBaseLayer"
            }
        },
        Tianditu: {
            vec: {
                func: "addTiandituBaseLayer"
            },
            vec_0: {
                func: "addTiandituBaseLayer"
            },
            img: {
                func: "addTiandituBaseLayer"
            },
            img_0: {
                func: "addTiandituBaseLayer"
            },
            ter: {
                func: "addTiandituBaseLayer"
            }
        },
        Amap: {
            vec_0: {
                func: "addAMapBaseLayer"
            },
            img: {
                func: "addAMapBaseLayer"
            },
            img_0: {
                func: "addAMapBaseLayer"
            }
        }
    }
}
