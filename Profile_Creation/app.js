import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProfileCreationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    interests: '',
    profilePicture: null,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age || formData.age < 18)
      newErrors.age = 'Valid age is required (18+)';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.interests)
      newErrors.interests = 'At least one interest is required';
    if (!formData.profilePicture)
      newErrors.profilePicture = 'Profile picture is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setSuccess(true);
      setErrors({});
    } else {
      setErrors(newErrors);
      setSuccess(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, profilePicture: file });
      setErrors({ ...errors, profilePicture: '' });
    } else {
      setErrors({
        ...errors,
        profilePicture: 'Please upload a valid image file',
      });
    }
  };

  return (
    <Card className='w-full max-w-lg mx-auto'>
      <CardHeader>
        <CardTitle>Create Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Input
              id='name'
              placeholder='Name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? 'border-red-500' : ''}
              data-testid='name-input'
            />
            {errors.name && (
              <p className='text-red-500 text-sm mt-1'>{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              id='age'
              type='number'
              placeholder='Age'
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className={errors.age ? 'border-red-500' : ''}
              data-testid='age-input'
            />
            {errors.age && (
              <p className='text-red-500 text-sm mt-1'>{errors.age}</p>
            )}
          </div>

          <div>
            <select
              id='gender'
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className={`w-full p-2 border rounded ${
                errors.gender ? 'border-red-500' : ''
              }`}
              data-testid='gender-select'
            >
              <option value=''>Select Gender</option>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
            {errors.gender && (
              <p className='text-red-500 text-sm mt-1'>{errors.gender}</p>
            )}
          </div>

          <div>
            <Input
              id='location'
              placeholder='Location'
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className={errors.location ? 'border-red-500' : ''}
              data-testid='location-input'
            />
            {errors.location && (
              <p className='text-red-500 text-sm mt-1'>{errors.location}</p>
            )}
          </div>

          <div>
            <Input
              id='interests'
              placeholder='Interests (comma-separated)'
              value={formData.interests}
              onChange={(e) =>
                setFormData({ ...formData, interests: e.target.value })
              }
              className={errors.interests ? 'border-red-500' : ''}
              data-testid='interests-input'
            />
            {errors.interests && (
              <p className='text-red-500 text-sm mt-1'>{errors.interests}</p>
            )}
          </div>

          <div>
            <Input
              id='profilePicture'
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className={errors.profilePicture ? 'border-red-500' : ''}
              data-testid='profile-picture-input'
            />
            {errors.profilePicture && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.profilePicture}
              </p>
            )}
          </div>

          <Button type='submit' className='w-full' data-testid='submit-button'>
            Create Profile
          </Button>

          {success && (
            <Alert className='mt-4 bg-green-50'>
              <AlertDescription>Profile created successfully!</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileCreationForm;
