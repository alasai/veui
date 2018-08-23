import Overlay from '@/components/Overlay'
import Vue from 'vue'

describe('components/Overlay', () => {
  it('should put the layer root node directly below the body.', done => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vm = new Vue({
      el: container,
      render () {
        return <Overlay />
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$el).toBe(
        document.body.querySelector('.veui-overlay')
      )
      vm.$destroy()
      done()
    })
  })

  it('should provide default slot.', done => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const vm = new Vue({
      el: container,
      render () {
        return <Overlay>content</Overlay>
      }
    })

    setTimeout(() => {
      const overlay = vm.$children[0].$vnode.componentInstance
      expect(overlay.$el.innerHTML).toBe('content')
      vm.$destroy()
      done()
    })
  })

  it('should generate proper zIndex when the two overlays have parent-child relationship.', done => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    new Vue({
      el: container,
      render () {
        return (
          <Overlay class="parent-overlay" ref="parent">
            <Overlay class="child-overlay" ref="child"/>
          </Overlay>
        )
      },
      mounted () {
        expect(+this.$refs.parent.$el.style.zIndex).toBe(200)
        expect(+this.$refs.child.$el.style.zIndex).toBe(201)
        this.$destroy()
        done()
      }
    })
  })

  it('should cover the previous\'s overlay\'s child overlay.', done => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    new Vue({
      el: container,
      data () {
        return {
          parentVisible: false,
          childVisible: false,
          nextVisible: false
        }
      },
      render () {
        return (
          <div>
            <Overlay ref="parent" open={this.parentVisible}>
              <Overlay ref="child" open={this.childVisible} />
            </Overlay>
            <Overlay ref="next" open={this.nextVisible}></Overlay>
          </div>
        )
      },
      mounted () {
        setTimeout(() => {
          this.parentVisible = true

          setTimeout(() => {
            this.nextVisible = true

            setTimeout(() => {
              this.childVisible = true

              setTimeout(() => {
                expect(this.$refs.parent.zIndex).toBe(200)
                expect(this.$refs.child.zIndex).toBe(201)
                expect(this.$refs.next.zIndex).toBe(202)
                this.$destroy()
                done()
              })
            })
          })
        })
      }
    })
  })
})
