export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          <strong>Last updated:</strong> {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          AI SellEasy collects information you provide when using our service to generate 
          product listings, including product images and descriptions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Generate AI-powered product descriptions</li>
          <li>Create product listings on your behalf</li>
          <li>Improve our service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Storage</h2>
        <p className="mb-4">
          Your data is stored securely and is not shared with third parties except 
          as necessary to provide our services (e.g., Google Cloud AI).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have questions about this privacy policy, please contact us at 
          privacy@ai-selleasy.com
        </p>
      </div>
    </div>
  )
}
