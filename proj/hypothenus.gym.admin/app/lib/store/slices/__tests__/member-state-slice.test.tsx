import memberStateReducer, {
    MemberState,
    clearMemberState,
    initialState,
    updateMemberPhotoUri,
    updateMemberState,
} from "../member-state-slice";
import { Member, newMember } from "@/src/lib/entities/member";

function makeMember(overrides: Partial<Member> = {}): Member {
    return { ...newMember(), uuid: "member-1", ...overrides };
}

describe("memberStateSlice reducer", () => {
    it("has correct initial state", () => {
        const state = memberStateReducer(undefined, { type: "@@INIT" });
        expect(state.member).toBeDefined();
        expect(state.member.uuid).toBeNull();
    });

    describe("updateMemberState", () => {
        it("replaces the member with the payload", () => {
            const member = makeMember();
            const state = memberStateReducer(initialState, updateMemberState(member));
            expect(state.member.uuid).toBe("member-1");
        });
    });

    describe("clearMemberState", () => {
        it("resets member to a new empty member", () => {
            const preState: MemberState = { member: makeMember() };
            const state = memberStateReducer(preState, clearMemberState());
            expect(state.member.uuid).toBeNull();
        });
    });

    describe("updateMemberPhotoUri", () => {
        it("updates the photo URI on the nested person", () => {
            const preState: MemberState = { member: makeMember() };
            const state = memberStateReducer(preState, updateMemberPhotoUri("http://example.com/photo.jpg"));
            expect(state.member.person.photoUri).toBe("http://example.com/photo.jpg");
        });

        it("does not mutate other person fields", () => {
            const member = makeMember();
            member.person.email = "original@example.com";
            const preState: MemberState = { member };
            const state = memberStateReducer(preState, updateMemberPhotoUri("http://new.jpg"));
            expect(state.member.person.email).toBe("original@example.com");
        });
    });
});
