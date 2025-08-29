'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import RodaDeCores from '../RodaDeCores';

function PickerColor() {
  const [color, setColor] = useState("#FFFFFF");

  return (
    <div className="px-6 py-6 picker-color border border-gray-800 flex flex-col rounded-xl">
      <div className='flex mb-5'>
        <Image src="/icons/paletaGodê.svg" alt="Paleta Godê" width={24} height={24} className='' />
        <h2 className='font-semibold text-xl ml-3'>Seletor de Cores Avançado</h2>
      </div>
      <RodaDeCores
        color={color}
        onChange={setColor}
        size={280}
      />
    </div>
  )
}

export default PickerColor;