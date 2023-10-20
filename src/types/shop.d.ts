
export type CategoryTData = {
    id: number;
    name: string;
    slug: string;
    parent: number;
    children: CategoryTData[];
}
export type BrandTData = {
    id: number;
    name: string;
    slug: string;
}

export type ImageTData = {
    id: number;
    image: string;
    alt_text: string;
    is_feature: boolean;
    created_at: string;
    updated_at: string;

}
type ProductAttributeTData = {
    name: string;
};
export type SpecificationTData = {
    id: number;
    product_attribute: ProductAttributeTData;
    attribute_value: string;
    description: string;

};

export type InventoryTData = {
    id: number;
    is_default: boolean;
    is_active: boolean;
    specification: SpecificationTData[];
    sku: string;
    store_price: number;
    sale_price: number;
    retail_price: number;
    is_on_sale: boolean;
    created_at: string;
    updated_at: string;
    images: ImageTData[];

}


export type ProductTData = {
    id: number;
    name: string;
    slug: string;
    avg_rating: number;
    total_rating: number;
    min_price: number;
    is_in_wishlist: boolean;
    product_type: {
        name: string;
    };
    inventory: InventoryTData[];
    category: {
        id: number;
        name: string;
        slug: string;
    };
    brand: BrandTData;
    description: string;
    is_feature: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    features: {
        feature_name: string;
        feature_value: string;
    }[]
}

export type APIResponse<T> = {
    data: {
        count: number;
        next: string;
        previous: string;
        results: T[] | T;
    }

}
export type PageTData = {
    pages: {
        results: Product[];

    }
    // other properties
}

export type CartTItem = {
    id: number;
    quantity: number;
    product: ProductTData
}

export type CartTAPI = {
    cart_total_price: number;
    id: number;
    user: number;
    items_count: number;
    created_at: string;
}

export type CartTAPIItem = {
    id?: number;
    quantity: number;
    cart?: string;
    product_name?: string;
    product_slug?: string;
    product_inventory: number;
    discount_percentage?: float;
    specification?: SpecificationTData[];
    attribute_values?: SpecificationTData[];
    unit_price: float;
    sale_price?: float;
}  