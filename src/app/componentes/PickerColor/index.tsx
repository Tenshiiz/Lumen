'use client'
<<<<<<< HEAD
=======

import React, { useEffect, useState } from 'react'
>>>>>>> 6e5cdabad9d1d6b49abf0ebe207101a21e42c1fd
import Image from 'next/image'
import RodaDeCores from '../RodaDeCores'
import InputColors from '../InputColors'
import { useToast } from '../../../context/ToastContext' // Hook para mostrar notificações globais
interface PickerColorProps {
  cor: string;
  setarCor: (value: string) => void;
  setValor: React.Dispatch<React.SetStateAction<string>>;
}

function PickerColor({ cor, setarCor, setValor }: PickerColorProps) {

  // Hook do contexto do toast para mostrar notificações
  const { showToast } = useToast()

  return (
    <div className="px-6 py-6 w-164 border border-gray-800 flex flex-col rounded-xl">
      <div className='flex mb-5'>
        <Image src="/icons/paletaGodê.svg" alt="Paleta Godê" width={24} height={24} />
        <h2 className='font-semibold text-xl ml-3'>Seletor de Cores Avançado</h2>
      </div>

      <div className='flex justify-between gap-4'>
        <RodaDeCores color={cor} onChange={setarCor} onCommit={setValor} size={280} />

        <div className='flex flex-col items-center'>
          <div className="relative w-75 h-32 rounded-xl group" style={{ backgroundColor: cor }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(cor).then(() => {
                  showToast('Cor copiada para a área de transferência!')
                }).catch(() => {
                  showToast('Erro ao copiar a cor')
                })
              }}
              className=" cursor-pointer
                absolute top-2 right-2
                bg-black/50 hover:bg-black/70
                text-white rounded-md px-2 py-1
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

          <div className='gap-y-1 gap-x-5 w-78 grid grid-cols-2 grid-rows-2 mt-3'>
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
