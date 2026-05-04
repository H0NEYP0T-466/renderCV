import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { ResumeData, SectionConfig, SectionId } from '../types';
import { defaultResume, defaultSections } from '../data/defaultResume';

const STORAGE_KEY_DATA = 'rendercv_data';
const STORAGE_KEY_SECTIONS = 'rendercv_sections';

interface ResumeState {
  data: ResumeData;
  sections: SectionConfig[];
  activeTemplate: string;
}

type Action =
  | { type: 'UPDATE_HEADER'; payload: Partial<ResumeData['header']> }
  | { type: 'UPDATE_SUMMARY'; payload: string }
  | { type: 'UPDATE_EXPERIENCE'; payload: ResumeData['experience'] }
  | { type: 'UPDATE_EDUCATION'; payload: ResumeData['education'] }
  | { type: 'UPDATE_PROJECTS'; payload: ResumeData['projects'] }
  | { type: 'UPDATE_SKILLS'; payload: ResumeData['skills'] }
  | { type: 'UPDATE_AWARDS'; payload: ResumeData['awards'] }
  | { type: 'REORDER_SECTIONS'; payload: SectionConfig[] }
  | { type: 'TOGGLE_SECTION'; payload: SectionId }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'LOAD_DATA'; payload: ResumeData }
  | { type: 'LOAD_STATE'; payload: ResumeState }
  | { type: 'RESET' };

function reducer(state: ResumeState, action: Action): ResumeState {
  switch (action.type) {
    case 'UPDATE_HEADER':
      return {
        ...state,
        data: { ...state.data, header: { ...state.data.header, ...action.payload } },
      };
    case 'UPDATE_SUMMARY':
      return { ...state, data: { ...state.data, summary: action.payload } };
    case 'UPDATE_EXPERIENCE':
      return { ...state, data: { ...state.data, experience: action.payload } };
    case 'UPDATE_EDUCATION':
      return { ...state, data: { ...state.data, education: action.payload } };
    case 'UPDATE_PROJECTS':
      return { ...state, data: { ...state.data, projects: action.payload } };
    case 'UPDATE_SKILLS':
      return { ...state, data: { ...state.data, skills: action.payload } };
    case 'UPDATE_AWARDS':
      return { ...state, data: { ...state.data, awards: action.payload } };
    case 'REORDER_SECTIONS':
      return { ...state, sections: action.payload };
    case 'TOGGLE_SECTION':
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload ? { ...s, enabled: !s.enabled } : s
        ),
      };
    case 'SET_TEMPLATE':
      return { ...state, activeTemplate: action.payload };
    case 'LOAD_DATA':
      return { ...state, data: action.payload };
    case 'LOAD_STATE':
      return action.payload;
    case 'RESET':
      return {
        data: defaultResume,
        sections: defaultSections.map((s) => ({ ...s })),
        activeTemplate: 'modern',
      };
    default:
      return state;
  }
}

function loadInitialState(): ResumeState {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    const savedSections = localStorage.getItem(STORAGE_KEY_SECTIONS);
    if (savedData) {
      const data = JSON.parse(savedData) as ResumeData;
      const sections = savedSections
        ? (JSON.parse(savedSections) as SectionConfig[])
        : defaultSections.map((s) => ({ ...s }));
      return { data, sections, activeTemplate: 'modern' };
    }
  } catch {
    // ignore parse errors
  }
  return {
    data: defaultResume,
    sections: defaultSections.map((s) => ({ ...s })),
    activeTemplate: 'modern',
  };
}

interface ResumeContextValue {
  state: ResumeState;
  dispatch: React.Dispatch<Action>;
  updateHeader: (payload: Partial<ResumeData['header']>) => void;
  updateSummary: (payload: string) => void;
  updateExperience: (payload: ResumeData['experience']) => void;
  updateEducation: (payload: ResumeData['education']) => void;
  updateProjects: (payload: ResumeData['projects']) => void;
  updateSkills: (payload: ResumeData['skills']) => void;
  updateAwards: (payload: ResumeData['awards']) => void;
  reorderSections: (payload: SectionConfig[]) => void;
  toggleSection: (payload: SectionId) => void;
  loadResume: (payload: ResumeData) => void;
  resetResume: () => void;
  exportJSON: () => string;
  importJSON: (json: string) => boolean;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(state.data));
    localStorage.setItem(STORAGE_KEY_SECTIONS, JSON.stringify(state.sections));
  }, [state.data, state.sections]);

  const updateHeader = useCallback(
    (payload: Partial<ResumeData['header']>) => dispatch({ type: 'UPDATE_HEADER', payload }),
    []
  );
  const updateSummary = useCallback(
    (payload: string) => dispatch({ type: 'UPDATE_SUMMARY', payload }),
    []
  );
  const updateExperience = useCallback(
    (payload: ResumeData['experience']) => dispatch({ type: 'UPDATE_EXPERIENCE', payload }),
    []
  );
  const updateEducation = useCallback(
    (payload: ResumeData['education']) => dispatch({ type: 'UPDATE_EDUCATION', payload }),
    []
  );
  const updateProjects = useCallback(
    (payload: ResumeData['projects']) => dispatch({ type: 'UPDATE_PROJECTS', payload }),
    []
  );
  const updateSkills = useCallback(
    (payload: ResumeData['skills']) => dispatch({ type: 'UPDATE_SKILLS', payload }),
    []
  );
  const updateAwards = useCallback(
    (payload: ResumeData['awards']) => dispatch({ type: 'UPDATE_AWARDS', payload }),
    []
  );
  const reorderSections = useCallback(
    (payload: SectionConfig[]) => dispatch({ type: 'REORDER_SECTIONS', payload }),
    []
  );
  const toggleSection = useCallback(
    (payload: SectionId) => dispatch({ type: 'TOGGLE_SECTION', payload }),
    []
  );
  const loadResume = useCallback(
    (payload: ResumeData) => dispatch({ type: 'LOAD_DATA', payload }),
    []
  );
  const resetResume = useCallback(() => dispatch({ type: 'RESET' }), []);

  const exportJSON = useCallback(() => {
    return JSON.stringify({ data: state.data, sections: state.sections }, null, 2);
  }, [state.data, state.sections]);

  const importJSON = useCallback(
    (json: string): boolean => {
      try {
        const parsed = JSON.parse(json);
        if (parsed.data) {
          dispatch({ type: 'LOAD_STATE', payload: parsed });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    []
  );

  return (
    <ResumeContext.Provider
      value={{
        state,
        dispatch,
        updateHeader,
        updateSummary,
        updateExperience,
        updateEducation,
        updateProjects,
        updateSkills,
        updateAwards,
        reorderSections,
        toggleSection,
        loadResume,
        resetResume,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
