
import { useState, useEffect } from 'react';
import { digitalLaunchTemplates as templatesData } from '@/features/digital-launch/data/templates';

export const useDigitalLaunchTemplates = () => {
  const [digitalLaunchTemplates, setDigitalLaunchTemplates] = useState([]);

  useEffect(() => {
    // @ts-ignore
    setDigitalLaunchTemplates(templatesData);
  }, []);

  return { digitalLaunchTemplates };
};
