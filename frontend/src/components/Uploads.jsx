import React, { useState } from "react";
import FileUpload from "./FileUpload";
import FileList from "./FileList";

const Uploads = () => {
  const [refreshKey, setRefreshKey] = useState(false);

  return (
    <div className="px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Center</h1>
          <p className="text-slate-400">
            Securely upload and manage your files with military-grade encryption
          </p>
          <div className="mt-8">
          <FileList refreshKey={refreshKey} />
        </div>
        </div>

        <FileUpload onUpload={() => setRefreshKey(!refreshKey)} />

        
      </div>
    </div>
  );
};

export default Uploads;
