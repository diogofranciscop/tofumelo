import Link from "next/link"

interface ButtonProps{
    path: string,
    name:string,
}

export default function ButtonHeader({path, name}: ButtonProps){

    return(
        <Link href={path} >
            {name}
        </Link>
        
    )
}