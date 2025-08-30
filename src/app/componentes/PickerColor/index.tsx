'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import RodaDeCores from '../RodaDeCores';
import InputColors from '../InputColors'; // importando o componente

function PickerColor() {
  const [color, setColor] = useState("#FFFFFF"); // estado central da cor

  return (
    <div className="px-6 py-6 w-164 border border-gray-800 flex flex-col rounded-xl">
      <div className='flex mb-5'>
        <Image src="/icons/paletaGodê.svg" alt="Paleta Godê" width={24} height={24} />
        <h2 className='font-semibold text-xl ml-3'>Seletor de Cores Avançado</h2>
      </div>

      <div className='flex justify-between gap-4'>
        {/* Roda de cores recebe o valor e função do estado do pai */}
        <RodaDeCores
          color={color}
          onChange={setColor}
          size={280}
        />

        <div className='flex flex-col items-center'>
          {/* Mostrador da cor */}
          <div className="w-75 h-32 rounded-xl" style={{ backgroundColor: color }}></div>

          {/* Grid de inputs */}
          <div className='gap-y-1 gap-x-5 w-78 grid grid-cols-2 grid-rows-2 mt-3'>
            <InputColors value={color} onChange={setColor} id='hex-input' label="HEX" />
            <InputColors value={color} onChange={setColor} id='rgb-input' label="RGB" format="rgb" />
            <InputColors value={color} onChange={setColor} id='hsl-input' label="HSL" format="hsl" />
            <InputColors value={color} onChange={setColor} id='cmyk-input' label="CMYK" format="cmyk" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PickerColor;
