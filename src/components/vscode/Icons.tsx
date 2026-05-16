import React from 'react';

export const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'tsx':
    case 'ts':
      return { icon: 'TS', color: '#3178c6', label: 'react' };
    case 'js':
    case 'jsx':
      return { icon: 'JS', color: '#f1e05a', label: 'javascript' };
    case 'css':
      return { icon: '#', color: '#569cd6', label: 'css' };
    case 'json':
      return { icon: '{}', color: '#dcdcaa', label: 'json' };
    case 'md':
      return { icon: 'M↓', color: '#4ec9b0', label: 'markdown' };
    case 'php':
      return { icon: 'PHP', color: '#4d588e', label: 'php' };
    case 'html':
      return { icon: '<>', color: '#e34c26', label: 'html' };
    default:
      return { icon: '', color: '#858585', label: 'file' };
  }
};

export function FileIcon({ filename, className = "w-4 h-4" }: { filename: string, className?: string }) {
  const { icon, color } = getFileIcon(filename);
  
  return (
    <span 
      style={{ color, fontWeight: 'bold', fontSize: '10px', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
      className={className}
    >
      {icon}
    </span>
  );
}
