// import ElectronicsMenu from '@/components/Menu'
// import React from 'react'

// function page() {
//   return (
//     <div>
//         <ElectronicsMenu />
//     </div>
//   )
// }

// export default page


import MenuList from '@/components/menu/MenuList';
import electronicsGadgets from '../../../data/dummydata.json';


export default function MenuPage() {
  return (
    <div className="min-h-screen mt-24">
      <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Electro Store</h1>
        <p className="text-center text-gray-600">Discover the latest in tech products</p>
      </div> 
        <MenuList menuData={electronicsGadgets.electronicsGadgets.map((item, index) => ({ ...item, id: index.toString() }))} />
      </div>
    </div>
  );
}