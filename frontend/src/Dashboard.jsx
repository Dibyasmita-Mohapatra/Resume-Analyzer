import React, { useEffect, useState } from "react";
import axios from "axios";

// Chart.js imports
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Dashboard({ refresh }) {
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [jobDesc, setJobDesc] = useState("");

  const calculateJobMatch = (skills) => {
    if (!jobDesc) return 0;

    const jobWords = jobDesc.toLowerCase().split(" ");
    const skillWords = String(skills).toLowerCase().split(",");

    const match = skillWords.filter((s) =>
      jobWords.includes(s.trim())
    ).length;

    return Math.round((match / skillWords.length) * 100);
  };

  const filteredResumes = resumes.filter((r) =>
    r.resumeName.toLowerCase().includes(search.toLowerCase()) ||
    r.skills.toLowerCase().includes(search.toLowerCase())
  );
  const sortedResumes = [...resumes].sort((a, b) => b.score - a.score);
  const [highlightId, setHighlightId] = useState(null);

  const totalResumes = resumes.length;

  const avgScore =
    resumes.length > 0
      ? Math.round(resumes.reduce((sum, r) => sum + r.score, 0) / resumes.length)
      : 0;

  const highestScore =
    resumes.length > 0
      ? Math.max(...resumes.map(r => r.score))
      : 0;

  // Example job description to match
  const jobDescription =
    "Looking for Java, Spring Boot, React, MySQL, AWS developer";

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/resumes")
      .then((res) => {
        setResumes(res.data);

        // Highlight the last uploaded resume
        if (res.data.length > 0) {
          setHighlightId(res.data[res.data.length - 1].id);

          // Remove highlight after 3 seconds
          setTimeout(() => setHighlightId(null), 3000);
        }
      })
      .catch((err) => console.error("Error fetching resumes:", err));
  }, [refresh]);

  const getBadgeColor = (score) => {
    if (score >= 80) return "bg-green-400";
    if (score >= 50) return "bg-yellow-400";
    return "bg-red-400";
  };

// Prepare Bar chart data for resume scores
  const scoreData = {
    labels: resumes.map((r) => r.resumeName),
    datasets: [
      {
        label: "Resume Score",
        data: resumes.map((r) => r.score),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1
      }
    ]
  };

// Prepare Pie chart data for skill distribution
  const skillCount = {};
  resumes.forEach((r) => {
    const skillsArray = r.skills.split(",");

    skillsArray.forEach((skill) => {
      const s = skill.trim();
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(skillCount),
    datasets: [
      {
        label: "Skill Frequency",
        data: Object.values(skillCount),
        backgroundColor: [
          "#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6",
          "#f97316", "#14b8a6", "#ec4899", "#facc15", "#6366f1"
        ]
      }
    ]
  };

  const calculateMatch = (skills) => {
    const resumeText = skills.join(" ").toLowerCase();
    const words = jobDescription.toLowerCase().split(" ");
    let match = 0;
    for (let word of words) {
      if (resumeText.includes(word)) match++;
    }
    return Math.round((match / words.length) * 100);
  };

const calculateATS = (score, matchPercent) => {

  let ats = (score * 0.6) + (matchPercent * 0.4);

  return Math.round(ats);

};

const bestMatch = filteredResumes.reduce((best, r) => {
  const score = calculateJobMatch(r.skills);
  if (!best || score > best.score) {
    return { resume: r, score };
  }
  return best;
}, null);


  return (
    <div>

      <div className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="text-xl font-bold">Resume Analyzer</h1>

        <div className="space-x-4">
          <button className="hover:underline">Dashboard</button>
          <button className="hover:underline">Upload Resume</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 p-6">
          <h2 className="text-3xl font-bold mb-6 text-center">
                  Uploaded Resumes
                </h2>
                <input
                  type="text"
                  placeholder="🔍 Search resume by name or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 border rounded mb-6"
                />

                <textarea
                  placeholder="📋 Paste Job Description here..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  className="w-full p-3 border rounded mb-6"
                  rows="4"
                />

                {jobDesc && bestMatch && (
                  <div className="bg-green-100 p-4 rounded mb-6 text-center">
                    <h3 className="font-bold text-lg">🏆 Best Matching Resume</h3>
                    <p>{bestMatch.resume.resumeName}</p>
                    <p className="text-green-700 font-semibold">
                      {bestMatch.score}% Match
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                  <div className="bg-blue-500 text-white p-6 rounded-lg shadow text-center">
                    <h3 className="text-lg font-semibold">📄 Total Resumes</h3>
                    <p className="text-3xl font-bold mt-2">{totalResumes}</p>
                  </div>

                  <div className="bg-green-500 text-white p-6 rounded-lg shadow text-center">
                    <h3 className="text-lg font-semibold">⭐ Average Score</h3>
                    <p className="text-3xl font-bold mt-2">{avgScore}%</p>
                  </div>

                  <div className="bg-yellow-500 text-white p-6 rounded-lg shadow text-center">
                    <h3 className="text-lg font-semibold">🏆 Highest Score</h3>
                    <p className="text-3xl font-bold mt-2">{highestScore}%</p>
                  </div>

                </div>
                <div className="bg-white p-6 rounded shadow mb-6">

                  <h2 className="text-xl font-bold mb-4">
                    🏆 Top Resumes
                  </h2>

                  {sortedResumes.slice(0,3).map((r, index) => {

                    const medals = ["🥇", "🥈", "🥉"];

                    return (
                      <div key={r.id} className="flex justify-between mb-2 p-2 bg-gray-100 rounded">
                        <span>
                          {medals[index]} {r.resumeName}
                        </span>

                        <span className="font-semibold">
                          {r.score}%
                        </span>
                      </div>
                    );

                  })}

                </div>

                {resumes.length === 0 ? (
                  <p className="text-center text-gray-500 text-lg">
                    No resumes uploaded yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResumes.map((r) => {
                      const matchPercent = calculateMatch(r.skills.split(","));
                      const atsScore = calculateATS(r.score, matchPercent);
                      return (
                        <div
                          key={r.id}
                          className={`p-4 rounded-lg shadow hover:shadow-lg transition
                          ${
                            bestMatch && bestMatch.resume.id === r.id
                              ? "bg-green-100 border-4 border-green-500"
                              : highlightId === r.id
                              ? "bg-blue-50 border-4 border-blue-400"
                              : "bg-white"
                          }`}
                        >
                          <h3 className="font-bold text-xl mb-2">{r.resumeName}</h3>

                          <p className="mb-1 font-semibold">Score:</p>
                          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                              className={`h-4 rounded-full ${getBadgeColor(r.score)}`}
                              style={{ width: `${r.score}%` }}
                            ></div>
                          </div>

                          <p className="text-sm mb-2">{r.score}%</p>

                          <p className="mb-2 font-semibold">Skills:</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {r.skills.split(",").map((skill, i) => (
                              <span
                                key={i}
                                className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm"
                              >
                                {skill.trim()}
                              </span>
                            ))}
                          </div>

                          <p className="mb-1 font-semibold">Job Match:</p>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                            <div
                              className="h-3 rounded-full bg-purple-400"
                              style={{ width: `${matchPercent}%` }}
                            ></div>
                          </div>

                          <p className="text-sm">{matchPercent}% match</p>
                          <p className="mt-2 font-semibold">ATS Score:</p>

                          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                            <div
                              className="h-3 rounded-full bg-green-500"
                              style={{ width: `${atsScore}%` }}
                            ></div>
                          </div>

                          <p className="text-sm">{atsScore}% ATS Match</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ADD CHARTS HERE INSIDE MAIN DIV */}

                <div className="mt-10 bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Resume Score Chart
                  </h2>

                  <Bar data={scoreData} />
                </div>

                <div className="mt-10 bg-white p-6 rounded shadow">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    Skills Distribution
                  </h2>

                  <Pie data={pieData} />
                </div>

      </div>




    </div>
  );
}

export default Dashboard;