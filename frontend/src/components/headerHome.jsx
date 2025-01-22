import { useState, useEffect } from "react";

function Header() {

    return (
        <>
            <div className="flex flex-row w-full h-12 items-center">
                <a className="mr-2 ml-2 font-poppins text-xl text-white" href="/">
                    CRYPToLIST
                </a>
                <a className="ml-2 mr-4" href="/">
                    Головна
                </a>
                <a className="mr-4" href="/review">
                    Огляд
                </a>
            </div>
        </>
    );
}

export default Header;
