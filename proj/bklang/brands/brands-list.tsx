"use client"

import { Page } from "@/src/lib/entities/page";
import BrandListDetails from "./brands-list-details";
import { Brand } from "@/src/lib/entities/brand";

export default function BrandsList({ pageOfBrands }: { pageOfBrands?: Page<Brand> }) {

  return (

    <div className="d-flex flex-row flex-wrap mt-2 mb-2">

      {pageOfBrands?.content.map((brand: Brand) => {
        return <BrandListDetails key={brand.brandId} brand={brand}></BrandListDetails>
      })}

    </div>
  );
}
