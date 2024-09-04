import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";



const ActionButton = ({ loading, idleText, loadingText }) => (
  <button
    type="submit"
    className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed `}
    disabled={loading}
  >
    {loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText || "Loading..."}
      </>
    ) : (
      idleText
    )}
  </button>
);

ActionButton.propTypes = {
    loading: PropTypes.bool,
    idleText: PropTypes.string,
    loadingText: PropTypes.string,
  };

export default ActionButton;