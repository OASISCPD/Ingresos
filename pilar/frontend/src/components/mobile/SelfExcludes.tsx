import { BiRefresh } from 'react-icons/bi'

import { ListSelfExcludeMobile } from './ListSelfExcludeMobile'

export function SelfExcludedMobile() {

    return (
        <div className="container mx-auto   my-8">
            <div className='flex justify-between items-center mt-8 mb-4 pb-1 mr-1 sm:hidden' >
                <h1 className="text-3xl  text-black ">Auto excluidos</h1>
                <BiRefresh onClick={() => window.location.reload()}
                    className="text-blueColor"
                    size={30}
                />
            </div>
            {/* <ListSelfExclude /> */}
            <ListSelfExcludeMobile />
        </div>
    )
}
