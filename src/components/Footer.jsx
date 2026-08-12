const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-6 mt-12 border-t">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {currentYear} ShopVibe. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
