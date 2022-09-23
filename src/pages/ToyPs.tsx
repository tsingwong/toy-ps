/*
 * @Description:
 * @Author: Tsingwong
 * @Date: 2022-09-23 16:19:00
 * @LastEditors: Tsingwong
 * @LastEditTime: 2022-09-23 17:51:39
 */

import Canvas from 'components/Canvas'
import type { ChangeEvent, ReactElement } from 'react'
import { useState } from 'react'

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
			<Canvas />
		</div>
	)
}
