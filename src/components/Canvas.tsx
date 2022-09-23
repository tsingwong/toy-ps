/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-09-23 17:15:14
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-09-23 17:57:03
 */
import type { ReactElement } from 'react'
import { useEffect, useRef } from 'react'

export default function Canvas(): ReactElement {
	const canvasReference = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const draw = (
			context_: CanvasRenderingContext2D,
			frameCount: number
		): void => {
			context_.clearRect(0, 0, context_.canvas.width, context_.canvas.height)
			// eslint-disable-next-line no-param-reassign
			context_.fillStyle = '#000000'
			context_.beginPath()
			context_.arc(
				50,
				100,
				20 * Math.sin(frameCount * 0.05) ** 2,
				0,
				2 * Math.PI
			)
			context_.fill()
		}
		const canvas = canvasReference.current
		if (!canvas) return () => {}
		const context = canvas.getContext('2d')
		if (!context) return () => {}
		let frameCount = 0
		let animationFrameId: number

		const render = (): void => {
			frameCount += 1
			draw(context, frameCount)
			animationFrameId = window.requestAnimationFrame(render)
		}

		render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	})
	return <canvas ref={canvasReference} />
}
