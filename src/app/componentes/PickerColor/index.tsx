'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import RodaDeCores from '../RodaDeCores'
import InputColors from '../InputColors'
import { useToast } from '../../../context/ToastContext'
interface PickerColorProps {
  cor: string;
  setarCor: (value: string) => void;
  setValor: React.Dispatch<React.SetStateAction<string>>;
}

function PickerColor({ cor, setarCor, setValor }: PickerColorProps) {

  const { showToast } = useToast()

  const [rodaSize, setRodaSize] = useState(240)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { 
        setRodaSize(180) 
      } else {
        setRodaSize(240) 
      }
    }

    handleResize() 
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 w-full max-w-4xl mx-auto border border-gray-800 flex flex-col rounded-xl">
      <div className='flex mb-3 sm:mb-4 lg:mb-5'>
        <Image src="/icons/paletaGodê.svg" alt="Paleta Godê" width={18} height={18} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        <h2 className='font-semibold text-base sm:text-lg lg:text-xl ml-2 sm:ml-2.5 lg:ml-3 text-center'>Seletor de Cores Avançado</h2>
      </div>

      <div className='flex flex-col lg:flex-row lg:justify-between gap-3 sm:gap-4 lg:gap-6'>
        <div className="flex justify-center lg:justify-start">
          <RodaDeCores color={cor} onChange={setarCor} onCommit={setValor} size={rodaSize} />
        </div>

        <div className='flex flex-col items-center lg:items-start'>
          <div className="relative w-48 sm:w-64 lg:w-75 h-20 sm:h-24 lg:h-32 rounded-xl group" style={{ backgroundColor: cor }}>
            {}
            <button
              onClick={() => {
                navigator.clipboard.writeText(cor).then(() => {
                  showToast('Cor copiada para a área de transferência!')
                }).catch(() => {
                  showToast('Erro ao copiar a cor')
                })
              }}
              className=" cursor-pointer
                absolute top-1.5 right-1.5 sm:top-2 sm:right-2
                bg-black/50 hover:bg-black/70
                text-white rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1
                text-xs font-medium
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                border border-white/20
              "
              title="Copiar cor"
            >
              📋 Copiar
            </button>
          </div>

          <div className='gap-y-1 gap-x-2 sm:gap-x-3 lg:gap-x-5 w-full max-w-xs lg:w-78 grid grid-cols-2 grid-rows-2 mt-2 sm:mt-3'>
            <InputColors value={cor} id='hex-input' label="HEX" />
            <InputColors value={cor} id='rgb-input' label="RGB" format="rgb" />
            <InputColors value={cor} id='hsl-input' label="HSL" format="hsl" />
            <InputColors value={cor} id='cmyk-input' label="CMYK" format="cmyk" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PickerColor
