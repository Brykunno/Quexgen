import React, { useState, useEffect } from 'react';
import Topnavbar from '../../components/Topnavbar';
import { Card, TextInput, Button, Label } from 'flowbite-react';
import api from '../../api';

function Settings() {
  const [settings, setSettings] = useState({
    chairperson: '',
    dean: '',
    director: '',
    academic_year: '',
  });
  
  const [loading, setLoading] = useState(false);


  const getInfo = () => {
    api.get(`/api/settings/`)
      .then((res) => {
        setSettings({
          chairperson: res.data[0].chairperson,
          dean: res.data[0].dean,
          director: res.data[0].director,
          academic_year: res.data[0].academic_year,
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  
  useEffect(() => {
    getInfo();
},[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/api/settings/1/', {
        chairperson: settings.chairperson,
        dean: settings.dean,
        director: settings.director,
        academic_year: settings.academic_year,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  return (
    <div>
      <Topnavbar title="Settings" />
      <div className="content">
        <Card>
          <div className='flex gap-5'>
            <div className='flex-1'>
              <Card>
                <h1 className='font-bold'>Administrative Officials</h1>
                <div>
                  <Label>Department Chairperson</Label>
                  <TextInput 
                    name="chairperson" 
                    value={settings.chairperson} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label>College Dean</Label>
                  <TextInput 
                    name="dean" 
                    value={settings.dean} 
                    onChange={handleChange} 
                  />
                </div>
                <div>
                  <Label>Campus Executive Director</Label>
                  <TextInput 
                    name="director" 
                    value={settings.director} 
                    onChange={handleChange} 
                  />
                </div>
              </Card>
            </div>
            <div className='flex-1'>
              <Card>
                <h1 className='font-bold'>Academic Year</h1>
                <TextInput 
                  name="academic_year" 
                  value={settings.academic_year} 
                  onChange={handleChange} 
                />
              </Card>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              color="primary" 
              className="mx-auto" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
