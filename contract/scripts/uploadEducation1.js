const { ethers } = require("hardhat");

async function main() {
  // Replace with your contract address
  const contractAddress = "0x0d44d332eBE03164A50798194603784155aec0CA"; // Localhost example
  
  // Get the contract instance
  const AfriCropDAO = await ethers.getContractFactory("AfriCropDAO");
  const africropDAO = await AfriCropDAO.attach(contractAddress);

  // Lesson data - customize as needed
  const lessonData = {
    title: "Sustainable Maize Farming",
    content: "Learn best practices for sustainable maize cultivation...",
    questions: {
      q1: "What is the optimal planting depth for maize?",
      q1Options: ["2-3 cm", "5-7 cm", "10-12 cm"],
      q2: "Which companion crop benefits maize the most?",
      q2Options: ["Beans", "Wheat", "Cotton"],
      q3: "How often should maize be watered in dry season?",
      q3Options: ["Daily", "Every 3-4 days", "Weekly"]
    },
    points: 100
  };

  // Add the lesson
  console.log("Adding lesson...");
  const tx = await africropDAO.addLesson(
    lessonData.title,
    lessonData.content,
    lessonData.questions.q1,
    lessonData.questions.q1Options[0], // Correct answer is always first option
    lessonData.questions.q1Options[1],
    lessonData.questions.q1Options[2],
    lessonData.questions.q2,
    lessonData.questions.q2Options[0], // Correct answer
    lessonData.questions.q2Options[1],
    lessonData.questions.q2Options[2],
    lessonData.questions.q3,
    lessonData.questions.q3Options[0], // Correct answer
    lessonData.questions.q3Options[1],
    lessonData.questions.q3Options[2],
    lessonData.points
  );

  await tx.wait();
  console.log("Lesson added successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });