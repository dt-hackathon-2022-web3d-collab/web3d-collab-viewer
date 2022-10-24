const Participants = () => {
  const particpants = [
    {
      name: "Casey Yee",
    },
    {
      name: "Avery Garmaise",
    },
    {
      name: "Jesse Liptak",
    },
    {
      name: "Xiaozhong Chen",
    },
    {
      name: "Tony Jreij",
    },
    {
      name: "Aurélien Carrère",
    },
    {
      name: "Yannick Simard",
    },
  ];

  return particpants.map((particpant, index) => (
    <div key={`participant-${index}`} className="inline-block bg-white p-3 m-1">
      {particpant.name}
    </div>
  ));
};

export default Participants;
