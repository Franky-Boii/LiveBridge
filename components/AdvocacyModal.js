const AdvocacyCard = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl p-8 max-w-md border-l-8 border-blue-600 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hello! I’m {userName}.</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          I use **LiveBridge AI** to communicate. It translates your speech into clear, 
          real-time text so I can follow our conversation perfectly. 
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800 font-semibold italic">
            "Deaf professionals contribute equal value—communication is just a bridge away."
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Got it! Let's start.
        </button>
      </div>
    </div>
  );
};