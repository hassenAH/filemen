import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from 'swiper';

import { useCart } from 'hooks/useCart';

import { Button, Slider } from 'components/common';
import { formatPrice } from 'helpers/format';

import styles from './index.module.scss';

const ProductCard = ({
  productId,
  title,
  brand,
  price,
  description,
  images,
  sizes,
  colors,
  stock,
  category,
  onTouchStart,
  onTouchEnd,
  onCardPick,
}) => {
  const location = useLocation();
  const isAdmin = location.pathname.split('/')[1] === 'admin';

  const { addItem, isLoading } = useCart();

  const [currentVariant, setCurrentVariant] = useState({
    images,
    sizes,
    colors,
    stock,
    price,
  });

  const [isSmallContainer, setIsSmallContainer] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const containerElement = containerRef.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setIsSmallContainer(width < 220);
      }
    });

    resizeObserver.observe(containerElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleAddItem = async (size) => {
    await addItem({
      productId,
      size,
      title,
      price: currentVariant.price,
      image: currentVariant.images[0], // Use the first image as default
    });
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${
        isSmallContainer ? styles.is_small_container : undefined
      }`}
    >
      <div className={styles.slider_container}>
        <Slider
          slides={currentVariant.images.map((img) => ({
            src: img, // Map images to the slider's format
          }))}
          slidesPerView={1}
          spaceBetween={0}
          centeredSlides={true}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={{
            nextEl: '.image-swiper-button-next',
            prevEl: '.image-swiper-button-prev',
            disabledClass: 'swiper-button-disabled',
          }}
          modules={[Navigation]}
          sliderClassName={styles.slider}
          slideClassName={styles.slide}
          mediaContainerClassName={styles.image_container}
          imageFillClassName={styles.image_fill}
          imageClassName={styles.image}
        />
      </div>

      <div className={styles.info_wrapper}>
        <ul className={styles.info_list}>
          <li className={styles.title}>
            {title} - {brand}
          </li>
          <li className={styles.description}>{description}</li>
          <li className={styles.price}>
            <span>${formatPrice(currentVariant.price)}</span>
          </li>
          <li className={styles.colors}>
            Colors: {currentVariant.colors}
          </li>
          <li className={styles.sizes}>
            Sizes: {currentVariant.sizes}
          </li>
          <li className={styles.stock}>
            Stock: {currentVariant.stock > 0 ? currentVariant.stock : 'Sold Out'}
          </li>
        </ul>
      </div>

      

      {isAdmin && (
        <div className={styles.admin_buttons_wrapper}>
          <Button className={styles.edit} to={`/admin/products/${productId}`}>
            Edit
          </Button>
          <Button
            onClick={() => {
              console.log('Delete product:', productId);
            }}
            className={styles.delete}
            type="button"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
