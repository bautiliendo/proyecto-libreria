'use client'

import Link from "next/link"
// import { IoCartOutline, IoSearchOutline } from "react-icons/io5"


export const TopMenu = () => {

    return (
        <nav className="flex flex-col p-5 justify-center items-center w-full">
            <div className="">
                <Link
                    href="/">
                    <span className="antialiased font-bold">Sistema</span>
                    <span > | Libreria </span>
                </Link>
            </div>
            <div className="py-2">
                <Link className="m-2 p-2 rounded-md  hover:scale-[1.04] hover:underline text-lg" href="/dashboard/agregar-libros">Agregar Libros</Link>
                <Link className="m-2 p-2 rounded-md  hover:scale-[1.04] hover:underline text-lg" href="/dashboard/prestamos">Prestamos</Link>
                <Link className="m-2 p-2 rounded-md  hover:scale-[1.04] hover:underline text-lg" href="/dashboard/libros">Libros</Link>

            </div>
        </nav>
    )
}
