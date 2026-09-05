import React from 'react';
import { useContent } from '../context/ContentContext';

export const AdminEditWrapper = ({ sectionKey, sectionTitle, children }) => {
  const { isAdmin, setActiveEditingSection } = useContent();

  if (!isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="admin-editable-section-wrapper">
      {/* Floating Section Edit Button */}
      <div className="admin-section-edit-badge">
        <button
          type="button"
          className="btn-trigger-section-edit"
          onClick={() => setActiveEditingSection({ key: sectionKey, title: sectionTitle })}
          title={`Modifier cette section (${sectionTitle})`}
        >
          <span className="edit-icon">✏️</span>
          <span>Modifier cette section</span>
        </button>
      </div>

      {children}
    </div>
  );
};
