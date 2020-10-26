import Vue from 'vue'

import ListenersMixin from 'quasar/src/mixins/listeners.js'

import { slot } from 'quasar/src/utils/slot.js'

export default Vue.extend({
  name: 'iwQPageSticky',

  mixins: [ ListenersMixin ],

  inject: {
    layout: {
      default () {
        console.error('QPageSticky needs to be child of QLayout')
      }
    }
  },

  props: {
    position: {
      type: String,
      default: 'bottom-right',
      validator: v => [
        'top-right', 'top-left',
        'bottom-right', 'bottom-left',
        'top', 'right', 'bottom', 'left'
      ].includes(v)
    },
    offset: {
      type: Array,
      validator: v => v.length === 2
    },
    expand: Boolean
  },

  methods: {
    appOffsets() {

      var box = this.$root.$el.getBoundingClientRect();

      var body = document.body;
      var docEl = document.documentElement;

      let screenWidth = docEl.clientWidth || body.clientWidth;
      let screenHeight = docEl.clientHeight || body.clientHeight;

      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

      var clientTop = docEl.clientTop || body.clientTop || 0;
      var clientLeft = docEl.clientLeft || body.clientLeft || 0;

      var top = box.top + scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return {
        top: (top),
        left: (left),
        right: (screenWidth - left - box.width),
        bottom: (screenHeight - top - box.height),
      };
    }
  },

  computed: {
    attach () {
      const pos = this.position

      return {
        top: pos.indexOf('top') > -1,
        right: pos.indexOf('right') > -1,
        bottom: pos.indexOf('bottom') > -1,
        left: pos.indexOf('left') > -1,
        vertical: pos === 'top' || pos === 'bottom',
        horizontal: pos === 'left' || pos === 'right'
      }
    },

    top () {
      return this.layout.header.offset
    },

    right () {
      return this.layout.right.offset
    },

    bottom () {
      return this.layout.footer.offset
    },

    left () {
      return this.layout.left.offset
    },

    style () {
      let
        posX = 0,
        posY = 0

      const
        attach = this.attach,
        dir = this.$q.lang.rtl === true ? -1 : 1

      if (attach.top === true && this.top !== 0) {
        posY = `${this.top}px`
      }
      else if (attach.bottom === true && this.bottom !== 0) {
        posY = `${-this.bottom}px`
      }

      if (attach.left === true && this.left !== 0) {
        posX = `${dir * this.left}px`
      }
      else if (attach.right === true && this.right !== 0) {
        posX = `${-dir * this.right}px`
      }

      const css = { transform: `translate(${posX}, ${posY}) !important` }

      if (this.offset) {
        css.margin = `${this.offset[1]}px ${this.offset[0]}px !important`
      }

      if (attach.vertical === true) {
        if (this.left !== 0) {
          css[this.$q.lang.rtl === true ? 'right' : 'left'] = `${this.left}px !important`
        }
        if (this.right !== 0) {
          css[this.$q.lang.rtl === true ? 'left' : 'right'] = `${this.right}px !important`
        }
      }
      else if (attach.horizontal === true) {
        if (this.top !== 0) {
          css.top = `${this.top}px !important`
        }
        if (this.bottom !== 0) {
          css.bottom = `${this.bottom}px !important`
        }
      } else {
        let appOffsets = this.appOffsets();
        console.log(appOffsets)
        css.bottom = `-${appOffsets.top}px !important`;
        css.right = `${appOffsets.right}px !important`;
      }

      return css
    },

    classes () {
      return `fixed-${this.position} q-page-sticky--${this.expand === true ? 'expand' : 'shrink'}`
    }
  },

  render (h) {
    const content = slot(this, 'default')

    return h('div', {
      staticClass: 'q-page-sticky row flex-center',
      class: this.classes,
      style: this.style,
      on: { ...this.qListeners }
    },
    this.expand === true
      ? content
      : [ h('div', content) ]
    )
  }
})
