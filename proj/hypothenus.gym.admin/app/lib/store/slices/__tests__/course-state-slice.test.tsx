import courseStateReducer, {
    CourseState,
    clearCourseState,
    initialState,
    updateCourseState,
} from "../course-state-slice";
import { Course, newCourse } from "@/src/lib/entities/course";

function makeCourse(overrides: Partial<Course> = {}): Course {
    return { ...newCourse(), uuid: "course-1", ...overrides };
}

describe("courseStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = courseStateReducer(undefined, { type: "@@INIT" });
        expect(state.course).toBeDefined();
        expect(state.course.uuid).toBeNull();
    });

    describe("updateCourseState", () => {
        it("replaces the course with the payload", () => {
            const course = makeCourse();
            const state = courseStateReducer(initialState, updateCourseState(course));
            expect(state.course.uuid).toBe("course-1");
        });
    });

    describe("clearCourseState", () => {
        it("resets course to a new empty course", () => {
            const preState: CourseState = { course: makeCourse() };
            const state = courseStateReducer(preState, clearCourseState());
            expect(state.course.uuid).toBeNull();
        });
    });
});
