import PropTypes from "prop-types";

const AvatarIcon = ({
  size = 40,
  color = "#e5e7eb",
  backgroundColor = "#6b7280",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" fill={backgroundColor} />
      <path
        d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z"
        fill={color}
      />
      <path
        d="M10 30.9338C10 27.7025 12.6863 25.0162 16.1125 25.0162H23.8875C27.3137 25.0162 30 27.7025 30 30.9338C30 31.5252 29.5252 32 28.9338 32H11.0662C10.4748 32 10 31.5252 10 30.9338Z"
        fill={color}
      />
    </svg>
  );
};

AvatarIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default AvatarIcon;