/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-09-23 16:19:00
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-09-28 19:40:19
 */

import { fabric } from 'fabric'
import type { ChangeEvent, ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'

function FabricJSCanvas(): ReactElement {
	const canvasElement = useRef(null)
	const canvas = useRef<fabric.Canvas>()
	useEffect(() => {
		const options = {}
		canvas.current = new fabric.Canvas(canvasElement.current, options)
		return () => {
			if (canvas.current) {
				canvas.current.dispose()
			}
		}
	}, [])
	const onClick = (): void => {
		const rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 20,
			height: 20,
			angle: 45
		})
		if (canvas.current) {
			canvas.current.add(rect)
		}
	}
	return (
		<>
			<button onClick={onClick} type='button'>
				add
			</button>
			<canvas width={300} height={300} ref={canvasElement} />
		</>
	)
}

export default function ToyPsPage(): ReactElement {
	const [file, setFile] = useState<File>()

	const onFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.files?.length) {
			setFile(event.target.files[0])
		}
	}
	return (
		<div className='m-5'>
			<h1>Toy Ps Page</h1>
			<input type='file' onChange={onFileUpload} />
			{file ? <img alt='img' src={URL.createObjectURL(file)} /> : undefined}
			<FabricJSCanvas />
		</div>
	)
}
