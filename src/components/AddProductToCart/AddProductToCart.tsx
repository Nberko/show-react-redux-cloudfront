import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart, isLoading: isUpdating } = useUpsertCart();
  const invalidateCart = useInvalidateCart();

  // Find cart item by matching productId
  const cartItem = data.find((i) => i.productId === product.id);

  const addProduct = () => {
    if (!product.id) return; // Safety check

    // Get current cart data to build the request
    const currentCart = data.filter((item) => item.count > 0);

    // Build products array for the request
    const products = cartItem
      ? currentCart.map((item) =>
          item.productId === product.id
            ? { productId: product.id, count: item.count + 1 }
            : { productId: item.productId, count: item.count }
        )
      : [...currentCart.map((item) => ({ productId: item.productId, count: item.count })), { productId: product.id, count: 1 }];

    upsertCart(
      { products },
      { onSuccess: invalidateCart }
    );
  };

  const removeProduct = () => {
    if (!product.id || !cartItem) return; // Safety check

    const currentCart = data.filter((item) => item.count > 0);

    // Build products array with reduced count (or remove if count becomes 0)
    const products = currentCart
      .map((item) =>
        item.productId === product.id
          ? { productId: product.id, count: item.count - 1 }
          : { productId: item.productId, count: item.count }
      )
      .filter((item) => item.count > 0);

    upsertCart(
      { products },
      { onSuccess: invalidateCart }
    );
  };

  const isDisabled = isFetching || isUpdating;

  return cartItem ? (
    <>
      <IconButton disabled={isDisabled} onClick={removeProduct} size="large">
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isDisabled} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isDisabled} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
