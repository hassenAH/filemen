import { Swiper, SwiperSlide } from 'swiper/react';
import { FaPlus } from 'react-icons/fa';

import styles from './index.module.scss';

const QuickAdd = ({
  isSmallContainer,
  skus,
  handleAddItem,
  isLoading,
  nested,
  onTouchStart,
  onTouchEnd,
  containerClassName,
  wrapperClassName,
  topContainerClassName,
  bottomContainerClassName,
  sizesSliderClassName,
}) => {
  const renderSize = (sku) => (
    <div
      key={sku.skuId}
      onClick={
        !isLoading && sku.quantity > 0
          ? () => handleAddItem({ skuId: sku.skuId, size: sku.size })
          : undefined
      }
      className={`
        ${sku.quantity > 0 ? styles.size : styles.size_no_quantity}
        ${isLoading && styles.no_show}`}
    >
      {sku.size}
    </div>
  );

  const renderSwiperSlide = (sku) => (
    <SwiperSlide
      key={sku.skuId}
      onClick={
        !isLoading && sku.quantity > 0
          ? () => handleAddItem({ skuId: sku.skuId, size: sku.size })
          : undefined
      }
      className={`
        ${sku.quantity > 0 ? styles.size : styles.size_no_quantity}
        ${isLoading && styles.no_show}`}
    >
      {sku.size}
    </SwiperSlide>
  );

  if (isSmallContainer) {
    return (
      <>
        <Swiper
          slidesPerView="auto"
          spaceBetween={5}
          nested={nested}
          centeredSlides={true}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className={sizesSliderClassName}
        >
          {skus.length > 0
            ? skus.map(renderSwiperSlide)
            : <div className={styles.no_sizes}>No sizes available</div>}
        </Swiper>
        {isLoading && <div className={styles.loader} />}
      </>
    );
  }

  return (
    <div className={containerClassName}>
      <div className={wrapperClassName}>
        <div className={topContainerClassName}>
          <p>Quick Add</p>
          <span>
            <FaPlus />
          </span>
        </div>
        <div className={bottomContainerClassName}>
          {skus.length > 0 ? (
            <div className={styles.sizes_wrapper}>
              {skus.map(renderSize)}
            </div>
          ) : (
            <div className={styles.no_sizes}>No sizes available</div>
          )}
          {isLoading && <div className={styles.loader}></div>}
        </div>
      </div>
    </div>
  );
};

QuickAdd.defaultProps = {
  skus: [],
  isSmallContainer: false,
  isLoading: false,
};

export default QuickAdd;
