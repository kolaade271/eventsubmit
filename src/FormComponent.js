import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button } from "react-bootstrap";
import "./FormComponent.css";

const FormComponent = () => {
  const [formData, setFormData] = useState({
    category: "",
    fullName: "",
    email: "",
    phone: "",
    department: "",
    description: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://app.paysnug.link/cont/category");
        const apiData = await response.json();
  
        if (apiData && apiData.data && Array.isArray(apiData.data)) {
          setCategories(apiData.data);
          setLoading(false);
        } else {
          console.error("Invalid API response:", apiData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };
  
    fetchCategories();
  }, []);
  

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    
  
    try {
      // Include category ID and name in the form data
      
      const formDataWithCategory = {
        ...formData,
        categoryId: formData.category,
        categoryName: categories.find(category => category.id === formData.category)?.name || ''
      };
  
      // Send form data to the webhook endpoint
      const response = await fetch("https://app.paysnug.link/cont/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formDataWithCategory)
      });
  
      if (response.ok) {
        toast.success("Form submitted successfully!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Form submission failed. Please try again.", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
      toast.error("Form submission failed. Please try again.", {
        autoClose: 3000,
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(value)
  
    if (name === "category") {
        const selectedCategory = categories.find(category => category.id === value);
        console.log(value)
      
      if (selectedCategory) {
        setFormData(prevData => ({
          ...prevData,
          categoryName: selectedCategory.name,
        }));
      }
    }
  };
  

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="main">
    <div className="container form-container mt-5">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select Category</Form.Label>
          <Form.Control
            as="select"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {loading ? (
              <option value="" disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control
            type="text"
            name="department"
            value={formData.department}
            autoComplete="off"
            onChange={handleInputChange}
            
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            autoComplete="off"
            value={formData.description}
            onChange={handleInputChange}
            
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </Form.Group>
        <Button variant="primary"  disabled={loading} className="long-button" type="submit">
        {loading ? "Loading..." : "Submit"}
        </Button>
      </Form>
      <ToastContainer />
      <br/>
      <br/>
    </div>
    </div>
  );
};

export default FormComponent;