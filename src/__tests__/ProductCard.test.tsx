import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types";

// Mock Next.js Link and Image to avoid router/image-optimization setup in tests
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockProduct: Product = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  images: ["https://cdn.dummyjson.com/product-images/1/1.jpg"],
};

describe("ProductCard", () => {
  it("renders the product title", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("iPhone 9")).toBeInTheDocument();
  });

  it("renders the discounted price correctly", () => {
    render(<ProductCard product={mockProduct} />);
    const discounted = (549 * (1 - 12.96 / 100)).toFixed(2);
    expect(screen.getByText(`$${discounted}`)).toBeInTheDocument();
  });

  it("renders the original price with strikethrough when discount >= 1%", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$549.00")).toBeInTheDocument();
  });

  it("renders the product category badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("smartphones")).toBeInTheDocument();
  });

  it("renders a link to the product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/products/1");
  });

  it("renders the product image with correct alt text", () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText("iPhone 9");
    expect(img).toBeInTheDocument();
  });

  it("shows discount badge when discountPercentage >= 10", () => {
    render(<ProductCard product={mockProduct} />);
    // discountPercentage is 12.96, so badge should appear
    expect(screen.getByText(/-\d+%/)).toBeInTheDocument();
  });

  it("does not show discount badge when discount < 10%", () => {
    const lowDiscountProduct: Product = { ...mockProduct, discountPercentage: 5 };
    render(<ProductCard product={lowDiscountProduct} />);
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
  });
});
