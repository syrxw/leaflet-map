L.drawLocal = {
  draw: {
    toolbar: {
      // #TODO: this should be reorganized where actions are nested in actions
      // ex: actions.undo  or actions.cancel
      actions: {
        title: "取消绘图", //'Cancel drawing',
        text: "", //'Cancel'
      },
      finish: {
        title: "完成绘图", //'Finish drawing',
        text: "Finish",
      },
      undo: {
        title: "删除最后绘制的点", //'Delete last point drawn',
        text: "", //'Delete last point'
      },
      buttons: {
        polyline: "绘制一个多段线", //'Draw a polyline',
        polygon: "绘制一个多边形", //'Draw a polygon',
        rectangle: "绘制一个矩形", //'Draw a rectangle',
        circle: "绘制一个圆", //'Draw a circle',
        marker: "绘制一个标记", //'Draw a marker',
        circlemarker: "绘制一个圆形标记", //'Draw a circlemarker'
      },
    },
    handlers: {
      circle: {
        tooltip: {
          start: "单击并拖动以绘制圆", //'Click and drag to draw circle.'
        },
        radius: "半径",
      },
      circlemarker: {
        tooltip: {
          start: "单击“地图”以放置圆标记", //'Click map to place circle marker.'
        },
      },
      marker: {
        tooltip: {
          start: "单击“地图”以放置标记", //'Click map to place marker.'
        },
      },
      polygon: {
        tooltip: {
          start: "单击开始绘制形状", //'Click to start drawing shape.',
          cont: "单击继续绘制形状", //'Click to continue drawing shape.',
          end: "单击第一个点关闭此形状", //'Click first point to close this shape.'
        },
      },
      polyline: {
        error: "<strong>错误:</strong>形状边缘不能交叉！", //'<strong>Error:</strong> shape edges cannot cross!',
        tooltip: {
          start: "单击开始绘制线", //'Click to start drawing line.',
          cont: "单击以继续绘制线", //'Click to continue drawing line.',
          end: "双击地图或单击最后一个点结束绘制", //'Click last point to finish line.'
        },
      },
      rectangle: {
        tooltip: {
          start: "单击并拖动以绘制矩形", //'Click and drag to draw rectangle.'
        },
      },
      simpleshape: {
        tooltip: {
          end: "释放鼠标完成绘图", //'Release mouse to finish drawing.'
        },
      },
    },
  },
  edit: {
    toolbar: {
      actions: {
        save: {
          title: "保存更改", //'Save changes',
          text: "保存", //'Save'
        },
        cancel: {
          title: "取消编辑，放弃所有更改", //'Cancel editing, discards all changes',
          text: "取消", //'Cancel'
        },
        clearAll: {
          title: "清除所有图层", //'Clear all layers',
          text: "清除所有", //'Clear All'
        },
      },
      buttons: {
        edit: "编辑图层", //'Edit layers',
        editDisabled: "无可编辑的图层", //'No layers to edit',
        remove: "删除图层", //'Delete layers',
        removeDisabled: "无可删除的图层", //'No layers to delete'
      },
    },
    handlers: {
      edit: {
        tooltip: {
          text: "拖动控制柄或标记以编辑要素", //'Drag handles or markers to edit features.',
          subtext: "单击“取消”撤消更改", //'Click cancel to undo changes.'
        },
      },
      remove: {
        tooltip: {
          text: "单击要删除的要素", //'Click on a feature to remove.'
        },
      },
    },
  },
};
