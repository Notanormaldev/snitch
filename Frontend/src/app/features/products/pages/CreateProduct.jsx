import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdCloudUpload } from 'react-icons/md'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import Logo from '../../auth/components/Logo'
import { useproduct } from '../hook/useproduct'
import './CreateProduct.css'

function CreateProduct() {
  const navigate = useNavigate()
  const { handlecreateproduct } = useproduct()

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceamount: '',
    pricecurrency: 'INR'
  })

  // Image state
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const fileInputRef = useRef(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [successProductName, setSuccessProductName] = useState('')
  const [uploadAreaActive, setUploadAreaActive] = useState(false)

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  // Handle image selection
  const handleImageSelect = (files) => {
    const fileArray = Array.from(files)
    const newImages = [...images, ...fileArray].slice(0, 7) // Max 7 images
    const newPreviews = newImages.map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setImages(newImages)
    setImagePreviews(newPreviews)

    if (error) setError('')
  }

  // Handle file input change
  const handleFileInputChange = (e) => {
    handleImageSelect(e.target.files)
  }

  // Handle click on upload area
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadAreaActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadAreaActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadAreaActive(false)
    handleImageSelect(e.dataTransfer.files)
  }

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)

    // Revoke object URL to free up memory
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index].preview)
    }

    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Product title is required')
      return false
    }

    if (!formData.description.trim()) {
      setError('Product description is required')
      return false
    }

    if (!formData.priceamount || parseFloat(formData.priceamount) <= 0) {
      setError('Valid price amount is required')
      return false
    }

    if (!formData.pricecurrency) {
      setError('Price currency is required')
      return false
    }

    if (images.length === 0) {
      setError('At least one product image is required')
      return false
    }

    return true
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // Build FormData
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title.trim())
      formDataToSend.append('description', formData.description.trim())
      formDataToSend.append('priceamount', parseFloat(formData.priceamount))
      formDataToSend.append('pricecurrency', formData.pricecurrency)

      // Append all images
      images.forEach((file) => {
        formDataToSend.append('images', file)
      })

      // Call API
      const result = await handlecreateproduct(formDataToSend)

      if (result.success) {
        setSuccessProductName(result.product.title)
        setSuccess(`✓ "${result.product.title}" successfully published! Your product is now live.`)

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            title: '',
            description: '',
            priceamount: '',
            pricecurrency: 'INR'
          })
          setImages([])
          setImagePreviews([])
          imagePreviews.forEach((item) => URL.revokeObjectURL(item.preview))
          setSuccess('')

          // Navigate to products dashboard after reset
          navigate('/products/seller')
        }, 3000)
      } else {
        setError(result.error || 'Failed to create product. Please try again.')
      }
    } catch (err) {
      console.error('Form submission error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'INR': return '₹'
      case 'USD': return '$'
      case 'EUR': return '€'
      case 'JPY': return '¥'
      case 'GBP': return '£'
      default: return currency
    }
  }

  const formatPrice = (amount) => {
    if (!amount) return '0.00'
    const parsed = parseFloat(amount)
    if (isNaN(parsed)) return '0.00'
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  return (
    <div className="createproduct-container">
      <div className="createproduct-wrapper">
        <div className="createproduct-header-section">
          <div className="createproduct-logo">
            <Logo />
          </div>
          <div className="createproduct-header-text">
            <h1 className="createproduct-title">List a New Product</h1>
            <p className="createproduct-subtitle">Fill in the details below to add your product</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="createproduct-form">
          <div className="createproduct-content">
            {/* LEFT PILLAR - Product Information */}
            <div className="createproduct-card details-card">
              <div className="card-header">
                <span className="card-step">01</span>
                <h2 className="card-title">Product Details</h2>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label className="form-label">Product Title</label>
                  <span className="char-counter">{formData.title.length} / 200</span>
                </div>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="e.g. Silk Velvet Draped Evening Gown"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="200"
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label className="form-label">Description</label>
                  <span className="char-counter">{formData.description.length} / 2000</span>
                </div>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Tell the storytelling narrative of this luxury masterpiece, highlighting its heritage, artisanal craftsmanship, and unique silhouette details..."
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={loading}
                  maxLength="2000"
                />
              </div>

              <div className="price-row">
                <div className="form-group">
                  <label className="form-label">Price Amount</label>
                  <div className="price-input-wrapper">
                    <span className="price-symbol-addon">{getCurrencySymbol(formData.pricecurrency)}</span>
                    <input
                      type="number"
                      name="priceamount"
                      className="form-input price-input"
                      placeholder="0.00"
                      value={formData.priceamount}
                      onChange={handleInputChange}
                      disabled={loading}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    name="pricecurrency"
                    className="form-select"
                    value={formData.pricecurrency}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="JPY">JPY - Japanese Yen (¥)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RIGHT PILLAR - Media, Preview & Publish */}
            <div className="createproduct-card media-card">
              <div className="card-header">
                <span className="card-step">02</span>
                <h2 className="card-title">Media & Publishing</h2>
              </div>

              <div className="media-section-inner">
                <label className="createproduct-images-label">Product Images</label>
                
                {/* Unified Media Upload Area */}
                {images.length === 0 ? (
                  <div
                    className={`image-upload-area ${uploadAreaActive ? 'active' : ''}`}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="image-upload-input"
                      onChange={handleFileInputChange}
                      disabled={loading}
                    />
                    <div className="upload-glow-effect"></div>
                    <MdCloudUpload className="upload-icon-svg" size={48} />
                    <span className="upload-text-primary">Click to upload or drag and drop</span>
                    <span className="upload-text-secondary">PNG, JPG, GIF up to 10MB each</span>
                    <span className="upload-limit">Maximum 7 images per product</span>
                  </div>
                ) : (
                  <div className="image-grid-container">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      className="image-upload-input"
                      onChange={handleFileInputChange}
                      disabled={loading || images.length >= 7}
                    />
                    <div className="image-previews-grid">
                      {imagePreviews.map((item, index) => (
                        <div key={index} className={`image-preview-item ${index === 0 ? 'cover-item' : ''}`}>
                          <img src={item.preview} alt={`Preview ${index + 1}`} />
                          {index === 0 ? (
                            <span className="cover-badge">COVER</span>
                          ) : (
                            <span className="index-badge">{index + 1}</span>
                          )}
                          <button
                            type="button"
                            className="image-preview-remove"
                            onClick={() => removeImage(index)}
                            disabled={loading}
                            title="Remove image"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {images.length < 7 && (
                        <div 
                          className="image-upload-tile"
                          onClick={handleUploadAreaClick}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          <FiPlus size={20} className="tile-plus-icon" />
                          <span className="tile-upload-text">Add More</span>
                          <span className="tile-upload-counter">{images.length} / 7</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Luxury Catalog Live Preview */}
              <div className="live-preview-section">
                <div className="live-preview-header">
                  <span className="live-preview-title-label">Live Catalog Preview</span>
                  <div className="live-pulse">
                    <span className="pulse-dot"></span>
                    <span className="pulse-text">Real-time</span>
                  </div>
                </div>

                <div className="luxury-preview-card">
                  <div className="preview-card-image-wrapper">
                    {imagePreviews.length > 0 ? (
                      <img src={imagePreviews[0].preview} alt="Product Cover Preview" className="preview-card-img" />
                    ) : (
                      <div className="preview-card-placeholder">
                        <div className="placeholder-logo-glow"></div>
                        <span className="placeholder-brand">LUOMI</span>
                        <span className="placeholder-hint">Upload media to see preview</span>
                      </div>
                    )}
                    <div className="preview-card-badge">LUXURY ORIGINAL</div>
                  </div>
                  
                  <div className="preview-card-info">
                    <div className="preview-card-brand-row">
                      <span className="preview-card-brand">LUOMI MAISON</span>
                      <span className="preview-card-status-badge">Seller Catalog</span>
                    </div>
                    
                    <h3 className="preview-card-title">
                      {formData.title.trim() || 'Untitled Creation'}
                    </h3>
                    
                    <p className="preview-card-desc">
                      {formData.description.trim() || 'A masterpiece waiting to be shared. Provide a description of your creation above to reveal its storytelling narrative.'}
                    </p>
                    
                    <div className="preview-card-footer">
                      <div className="preview-card-price-container">
                        <span className="preview-card-symbol">{getCurrencySymbol(formData.pricecurrency)}</span>
                        <span className="preview-card-price">{formatPrice(formData.priceamount)}</span>
                      </div>
                      <span className="preview-card-cta">Explore Silhouette</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-publish-block">
                <button
                  type="submit"
                  className="submit-button main-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Publishing Masterpiece...
                    </>
                  ) : (
                    'Publish Product'
                  )}
                </button>

                {error && <div className="error-message">{error}</div>}
                {success && (
                  <div className="success-message">
                    <span className="success-check">✓</span> 
                    <span className="success-product-name">"{successProductName}"</span> has been successfully added to your catalog.
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct
