/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-09-23 16:19:00
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-09-30 16:20:23
 */

import { fabric } from 'fabric'
import useWindow from 'hooks/useWindow'
import type { ChangeEvent, ReactElement } from 'react'
import { useEffect, useRef, useState } from 'react'

function TextEdit({
	text,
	set,
	fill,
	fontSize
}: {
	text: string
	fill: fabric.Gradient | fabric.Pattern | string | undefined
	set: (key: keyof fabric.Text, value: string) => void
	fontSize: number
}): ReactElement {
	const [data, setData] = useState({
		text,
		fill,
		fontSize
	})

	const onChange = (
		key: keyof fabric.Text,
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		setData({
			...data,
			[key]: event.target.value
		})
		set(key, event.target.value)
	}
	return (
		<div>
			<span>文字:</span>
			<input
				type='text'
				value={data.text}
				onChange={(event): void => onChange('text', event)}
			/>
			<span>颜色</span>
			<input
				type='color'
				value={data.fill}
				onChange={(event): void => onChange('fill', event)}
			/>
			<span>字体大小</span>
			<input
				type='range'
				value={data.fontSize}
				onChange={(event): void => onChange('fontSize', event)}
			/>
		</div>
	)
}

function calcProportion(
	picH: number,
	picW: number,
	windowH: number,
	windowW: number
): number {
	return Math.min(windowH / picH, windowW / picW)
}

// React.memo
function FabricJSCanvas({
	file,
	options: { height, width },
	proportion
}: {
	file: string
	options: {
		height: number
		width: number
	}
	proportion: number
}): ReactElement {
	const canvasElement = useRef(null)
	const canvas = useRef<fabric.Canvas>()
	const [select, setSelect] = useState<fabric.Object | undefined>()
	useEffect(() => {
		canvas.current = new fabric.Canvas(canvasElement.current)
		return () => {
			if (canvas.current) {
				canvas.current.dispose()
			}
		}
	}, [])
	useEffect(() => {
		if (file) {
			fabric.Image.fromURL(file, oImg => {
				if (canvas.current) {
					oImg.scale(proportion).setCoords()
					canvas.current.setBackgroundImage(
						oImg,
						canvas.current.renderAll.bind(canvas.current)
					)
				}
			})
		}
	}, [file, proportion])
	const onWaterMark = (): void => {
		const now = new Date()
		const text = new fabric.Text(
			`${now.getFullYear()}-${now.getMonth()}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
			{
				top: height * 0.95,
				left: width * 0.73
			}
		)
		const change = (): void => {
			setSelect(text)
		}
		if (canvas.current) {
			canvas.current.add(text)
			text.on('selected', change)
			text.on('deselected', () => {
				// eslint-disable-next-line unicorn/no-useless-undefined
				setSelect(undefined)
			})
		}
	}
	const onExport = (): void => {
		if (canvas.current) {
			const dataUrl = canvas.current.toDataURL({
				format: 'png'
			})
			const link = document.createElement('a')
			link.download = 'xxx.png'
			link.href = dataUrl
			document.body.append(link)
			link.click()
			link.remove()
		}
	}
	return (
		<>
			<section />
			<div className='flex max-h-screen flex-row space-x-4 '>
				<div className='basis-3/5'>
					<canvas width={width} height={height} ref={canvasElement} />
				</div>

				<div className='flex basis-2/5 flex-col'>
					<div className='basis-1/2 bg-red-100 p-2'>
						<p className='font-sans text-lg font-bold'>功能区</p>
						<button
							onClick={onWaterMark}
							type='button'
							className='rounded-full bg-cyan-500 px-4 py-1 text-sm font-semibold text-white shadow-sm'
						>
							时间水印
						</button>
						<button
							onClick={onExport}
							type='button'
							className='rounded-full bg-cyan-500 px-4 py-1 text-sm font-semibold text-white shadow-sm'
						>
							导出图片
						</button>
					</div>
					<div className='basis-1/2 bg-green-100 p-2'>
						<p className='font-sans text-lg font-bold'>编辑区</p>
						{select instanceof fabric.Text ? (
							<TextEdit
								text={select.text ?? ''}
								set={(key: keyof fabric.Text, value: string): void => {
									select.set(key, value)
									canvas.current?.renderAll()
								}}
								fontSize={select.fontSize ?? 0}
								fill={select.fill ?? ''}
							/>
						) : (
							''
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default function ToyPsPage(): ReactElement {
	const [file, setFile] = useState<File>()
	const { height: windowH, width: windowW } = useWindow()
	const [proportion, setProportion] = useState(0)
	const [options, setOptions] = useState({
		height: 0,
		width: 0
	})

	useEffect(() => {
		if (file) {
			const source = URL.createObjectURL(file)
			const img = new Image()
			img.src = source

			img.addEventListener('load', (): void => {
				const temporary = calcProportion(
					img.height,
					img.width,
					windowH,
					(windowW * 3) / 5
				)
				setProportion(temporary)
				setOptions({
					height: img.height * temporary,
					width: img.width * temporary
				})
			})
		}
	}, [file, windowH, windowW])

	const onFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.files?.length) {
			setFile(event.target.files[0])
		}
	}
	return (
		<div>
			{!file && <input type='file' onChange={onFileUpload} />}
			{file && options.width && options.height ? (
				<FabricJSCanvas
					file={URL.createObjectURL(file)}
					options={options}
					proportion={proportion}
				/>
			) : (
				''
			)}
		</div>
	)
}
