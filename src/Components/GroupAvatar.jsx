import AvatarIcon from "./AvatarIcon";
import PropTypes from "prop-types";

const GroupAvatar = ({ members, size = 50 }) => {
  const avatarSize = size * 0.7;
  const offset = size * 0.25;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {members.slice(0, 4).map((member, index) => (
        <div
          key={member.id}
          className="absolute rounded-full overflow-hidden border-2 border-white"
          style={{
            width: avatarSize,
            height: avatarSize,
            top: index % 2 === 0 ? 0 : offset,
            left: index < 2 ? 0 : offset,
            zIndex: 4 - index, // Stack avatars with the first one on top
          }}
        >
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarIcon size={avatarSize} />
          )}
        </div>
      ))}
    </div>
  );
};

GroupAvatar.propTypes = {
  members: PropTypes.array,
  size: PropTypes.number,
};
export default GroupAvatar;
