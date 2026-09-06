import { useState } from "react";
import { motion as m } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Plus, X, MapPin, DollarSign, Briefcase } from "lucide-react";

const POPULAR_ROLES = [
  "Frontend Engineer",
  "Senior Frontend Engineer",
  "Full Stack Developer",
  "Backend Engineer",
  "Product Designer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Product Manager",
  "React Developer",
];

export default function StepPreferences({ onNext, onBack, preferences, setPreferences }) {
  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);

  const filteredRoleSuggestions = POPULAR_ROLES.filter(
    (role) =>
      role.toLowerCase().includes(roleInput.toLowerCase()) &&
      !preferences.targetRoles?.includes(role)
  );

  const handleAddSkill = (e) => {
    e?.preventDefault();
    if (!skillInput.trim()) return;
    if (!preferences.skills.includes(skillInput.trim())) {
      setPreferences({
        ...preferences,
        skills: [...preferences.skills, skillInput.trim()],
      });
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setPreferences({
      ...preferences,
      skills: preferences.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAddRole = (roleToAdd) => {
    const role = roleToAdd || roleInput.trim();
    if (!role) return;
    if (!preferences.targetRoles.includes(role)) {
      setPreferences({
        ...preferences,
        targetRoles: [...preferences.targetRoles, role],
      });
    }
    setRoleInput("");
    setShowRoleSuggestions(false);
  };

  const handleRemoveRole = (roleToRemove) => {
    setPreferences({
      ...preferences,
      targetRoles: preferences.targetRoles.filter((r) => r !== roleToRemove),
    });
  };

  const handleWorkTypeToggle = (type) => {
    const current = preferences.workTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setPreferences({ ...preferences, workTypes: updated });
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={13} /> Step 2 of 3
        </span>
        <h2 className="font-fraunces text-3xl text-charcoal font-semibold mb-2">
          Career Preferences
        </h2>
        <p className="text-warm-gray text-sm max-w-md mx-auto">
          Tell us what kind of roles and compensation you're looking for to personalize your job feed.
        </p>
      </div>

      <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cream rounded-2xl border border-border p-6 shadow-sm space-y-6"
      >
        {/* Target Roles */}
        <div className="relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <Briefcase size={14} className="text-terracotta" /> Target Job Titles
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => {
                setRoleInput(e.target.value);
                setShowRoleSuggestions(true);
              }}
              onFocus={() => setShowRoleSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRole())}
              placeholder="Type to search roles e.g. Frontend Engineer..."
              className="auth-input text-sm flex-1"
            />
            <button
              type="button"
              onClick={() => handleAddRole()}
              className="bg-sand hover:bg-border text-charcoal px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showRoleSuggestions && filteredRoleSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[72px] bg-cream border border-border rounded-xl shadow-md z-20 max-h-48 overflow-y-auto py-1">
              {filteredRoleSuggestions.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleAddRole(role)}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-charcoal hover:bg-terracotta/10 hover:text-terracotta transition-colors flex items-center justify-between"
                >
                  <span>{role}</span>
                  <Plus size={13} className="text-warm-gray" />
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 min-h-[36px] mt-2">
            {preferences.targetRoles?.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-medium"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRemoveRole(role)}
                  className="hover:text-terracotta-dark"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Work Arrangement */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
            <MapPin size={14} className="text-terracotta" /> Preferred Work Setup
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["Remote", "Hybrid", "On-site"].map((setup) => {
              const active = preferences.workTypes?.includes(setup);
              return (
                <button
                  key={setup}
                  type="button"
                  onClick={() => handleWorkTypeToggle(setup)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all text-center ${
                    active
                      ? "bg-terracotta text-white border-terracotta shadow-xs"
                      : "bg-sand/60 text-charcoal border-border hover:bg-sand"
                  }`}
                >
                  {setup}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Expectation */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <DollarSign size={14} className="text-terracotta" /> Minimum Target Salary (USD / yr)
            </label>
            <span className="text-sm font-bold text-terracotta font-fraunces">
              ${(preferences.minSalary || 100000).toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="300000"
            step="5000"
            value={preferences.minSalary || 100000}
            onChange={(e) =>
              setPreferences({ ...preferences, minSalary: Number(e.target.value) })
            }
            className="w-full accent-terracotta cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-warm-gray mt-1 font-mono">
            <span>$50k</span>
            <span>$175k</span>
            <span>$300k+</span>
          </div>
        </div>

        {/* Top Skills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-2">
            Core Skills & Technologies
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill(e)}
              placeholder="e.g. Next.js, Python, GraphQL"
              className="auth-input text-sm flex-1"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="bg-sand hover:bg-border text-charcoal px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {preferences.skills?.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand border border-border text-xs font-medium text-charcoal"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-warm-gray hover:text-charcoal"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </m.div>

      {/* Navigation CTA */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary flex items-center gap-2 text-sm px-5 py-2.5"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <button
          type="button"
          onClick={onNext}
          className="btn-primary flex items-center gap-2 text-sm px-6 py-3"
        >
          Review Profile <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
