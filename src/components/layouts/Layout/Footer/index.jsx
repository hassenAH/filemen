import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import {
  FaInstagram,
  FaTwitterSquare,
  FaTiktok,
  FaFacebookF,
  FaYoutube,
} from 'react-icons/fa';


import styles from './index.module.scss';

const Footer = () => {
  const location = useLocation();

  const isBigScreen = useMediaQuery({
    query: '(min-width: 1024px)',
  });

  const isCollectionPage = location.pathname.includes('collections');

  return (
    <footer
      className={`${styles.footer} ${
        isCollectionPage && isBigScreen
          ? styles.is_collection_page_b
          : styles.is_collection_page_s
      }`}
    >
      {!isBigScreen }
      <div className={styles.container}>
        <div className={styles.sitemap}>
          <div className={styles.nav_wrapper}>
            <h4 className={styles.nav_title}>Help</h4>
            {/*<ul className={styles.nav}>
              <li>
                <Link to="/">Help Center</Link>
              </li>
              <li>
                <Link to="/">Contact Us</Link>
              </li>
              <li>
                <Link to="/">Shipping Info</Link>
              </li>
              <li>
                <Link to="/">Track My Order</Link>
              </li>
              <li>
                <Link to="/">Returns & Exchanges</Link>
              </li>
            </ul>*/}
          </div>
          
        </div>
        <div className={styles.socials_wrapper}>
          {isBigScreen }
          <div className={styles.socials}>
            <a
              href="https://www.instagram.com/filamenbrand/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>
            <a href="https://www.tiktok.com/@filamenbrand?lang=fr" target="_blank" rel="noreferrer">
              <FaTiktok />
            </a>
            
            <a href="https://facebook.com/profile.php?id=61568878031636&mibextid=wwXIfr&rdid=AsOdBGVvsnL4JeDN&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F15vj5a6L5Z%2F%3Fmibextid%3DwwXIfr" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
           
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
