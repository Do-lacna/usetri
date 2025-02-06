import { ShopItemDto } from "../network/model";

export const products: ShopItemDto[] = [
  {
    detail: {
      barcode: 123,
      image_url:
        "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
      name: "Svetle pivo",
      brand: "Kelt",
      amount: 0.5,
      unit: "l",
    },
    shop_id: 1,
    price: 12.7,
  },
  {
    detail: {
      barcode: 1235,
      image_url:
        "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
      name: "Svetle pivo",
      brand: "Kelt",
      amount: 0.5,
      unit: "l",
    },
    shop_id: 2,
    price: 13.7,
  },
  {
    detail: {
      barcode: 1234,
      image_url:
        "https://digitalcontent.api.tesco.com/v2/media/ghs/e0a0e446-3cee-4281-84ea-ca80461b8551/342cec25-6528-44cf-9328-bdda502f88c7_1825618099.jpeg?h=540&w=540",
      name: "Svetle pivo",
      brand: "Kelt",
      amount: 0.5,
      unit: "l",
    },
    shop_id: 3,
    price: 10.2,
  },
];
