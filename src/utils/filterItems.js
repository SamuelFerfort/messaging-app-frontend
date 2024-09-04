const filterItems = (items, filterText, activeTab) => {
  return items.filter((item) => {
    if (activeTab === "chats" || activeTab === "groups") {
      return item.name.toLowerCase().includes(filterText.toLowerCase());
    } else {
      return (item.firstName + " " + item.lastName)
        .toLowerCase()
        .includes(filterText.toLowerCase());
    }
  });
};

export default filterItems;
