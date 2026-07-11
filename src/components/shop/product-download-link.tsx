type ProductDownloadLinkProps = {
  productId: string;
  label: string;
  className?: string;
};

export function ProductDownloadLink({
  productId,
  label,
  className = "eldonia-btn-secondary text-sm",
}: ProductDownloadLinkProps) {
  return (
    <a
      href={`/api/shop/products/${productId}/download`}
      className={className}
      download
    >
      {label}
    </a>
  );
}
