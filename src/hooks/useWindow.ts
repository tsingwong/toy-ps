import { useEffect, useState } from 'react'

/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-09-29 14:12:15
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-09-29 14:37:58
 */
const getWindowWidth = (): number =>
	window.innerWidth ||
	document.documentElement.clientWidth ||
	document.body.clientWidth

const getWindowHeight = (): number =>
	window.innerHeight ||
	document.documentElement.clientHeight ||
	document.body.clientHeight

export default function useWindow(): {
	width: number
	height: number
} {
	const [width, setWidth] = useState(0)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		setWidth(getWindowWidth())
		setHeight(getWindowHeight())
		const onPageResize = (): void => {
			setWidth(getWindowWidth())
			setHeight(getWindowHeight())
		}
		window.addEventListener('resize', onPageResize)
		return (): void => {
			window.removeEventListener('resize', onPageResize)
		}
	}, [])
	return {
		width,
		height
	}
}
