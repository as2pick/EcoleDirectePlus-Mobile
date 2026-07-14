import { useAuthStore } from "@/hooks/useAuthStore";
import authService from "@/services/login/authService";
import storeDatas from "@/services/login/tools/storeLoginDatas";
import dayjs from "dayjs";

// Import the anonymized JSON files from the test folder
import mockTimetable from "../../test/emploidutemps_get.json";
import mockLogin from "../../test/login.json";
import mockMessageDetail103040 from "../../test/message_detail_103040.json";
import mockMessagesFolder564 from "../../test/messages_folder_564.json";
import mockMessagesReceived from "../../test/messages_received.json";
import mockGrades from "../../test/notes_get.json";

export const getGuestData = (url: string, body?: any): any => {
    // 1. Grades / Notes
    if (url.includes("/notes.awp")) {
        return mockGrades;
    }

    // 2. Timetable / Emploi du temps
    if (url.includes("/emploidutemps.awp")) {
        return getShiftedTimetable(body?.dateDebut);
    }

    // 3. Messages List
    if (url.includes("/messages.awp")) {
        if (
            url.includes("typeRecuperation=classeur") &&
            url.includes("idClasseur=564")
        ) {
            return mockMessagesFolder564;
        }
        return mockMessagesReceived;
    }

    // 4. Message Content / Details (messages/{messageId}.awp)
    const messageDetailMatch = url.match(/\/messages\/(\d+)\.awp/);
    if (messageDetailMatch) {
        const messageId = messageDetailMatch[1];
        if (messageId === "103040") {
            return mockMessageDetail103040;
        }
        return getGenericMessageDetail(messageId);
    }

    return null;
};

const getGenericMessageDetail = (messageId: string | number) => {
    const foundMsg =
        mockMessagesReceived?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        ) ||
        mockMessagesFolder564?.data?.messages?.received?.find(
            (m: any) => String(m.id) === String(messageId)
        );

    return {
        code: 200,
        token: "guest_token",
        host: "HTTP200",
        message: "",
        data: {
            id: Number(messageId),
            mtype: foundMsg?.mtype || "received",
            read: true,
            idDossier: foundMsg?.idDossier ?? -1,
            idClasseur: foundMsg?.idClasseur ?? 0,
            transferred: foundMsg?.transferred ?? false,
            answered: foundMsg?.answered ?? false,
            to_cc_cci: foundMsg?.to_cc_cci || "to",
            brouillon: foundMsg?.brouillon ?? false,
            subject: foundMsg?.subject || "Message de test",
            // Base64-encoded: "Bonjour,\n\nCeci est un message de test générique pour le mode invité.\n\nCordialement."
            content:
                "Qm9uan91ciwKCkNlY2kgZXN0IHVuIG1lc3NhZ2UgZGUgdGVzdCBn6W7pcmlxdWUgcG91ciBsZSBtb2RlIGludml06S4KCkNvcmRpYWxlbWVudC4=",
            date: foundMsg?.date || "2026-06-22 10:00:00",
            to: [],
            files: [],
            from: foundMsg?.from || {
                nom: "EDP",
                prenom: "Support",
                civilite: "",
                role: "A",
                id: 999,
            },
        },
    };
};

const getShiftedTimetable = (requestedMonday?: string) => {
    if (!requestedMonday) return mockTimetable;

    const courses = mockTimetable.data || [];
    const firstCourse = courses.find((c: any) => c.start_date);
    if (!firstCourse) return mockTimetable;

    // Find the Monday of the first course in the mock data
    const mockFirstDate = dayjs(firstCourse.start_date.split(" ")[0]);
    const mockDayOfWeek = mockFirstDate.day();
    const daysToSubtract = mockDayOfWeek === 0 ? 6 : mockDayOfWeek - 1;
    const mockMonday = mockFirstDate.subtract(daysToSubtract, "day");

    // Calculate diff between the requested Monday and the mock Monday in days
    const reqMonday = dayjs(requestedMonday);
    const diffInDays = reqMonday.diff(mockMonday, "day");

    // Shift all courses by the difference in days
    const shiftedCourses = courses.map((course: any) => {
        if (!course.start_date || !course.end_date) return course;

        const start = dayjs(course.start_date);
        const end = dayjs(course.end_date);

        return {
            ...course,
            start_date: start.add(diffInDays, "day").format("YYYY-MM-DD HH:mm"),
            end_date: end.add(diffInDays, "day").format("YYYY-MM-DD HH:mm"),
        };
    });

    return {
        ...mockTimetable,
        data: shiftedCourses,
    };
};

export const loginAsGuest = async (keepConnected: boolean = true) => {
    const accountData = mockLogin?.data?.accounts?.[0] || {
        id: 7875,
        typeCompte: "E",
        prenom: "Invité",
        nom: "Démo",
        email: "guest@ecoledirecteplus.fr",
        nomEtablissement: "Établissement Invité",
        profile: {
            sexe: "M",
            telPortable: "0600000000",
            classe: {
                libelle: "Classe Invité",
                code: "GUEST",
            },
        },
    };

    console.log("Bienvenue dans le compte développeur");

    if (keepConnected) {
        await authService.saveCredentials("guest_token", accountData.id, {
            identifiant: process.env.EXPO_PUBLIC_GUEST_USERNAME || "guest",
            motdepasse: process.env.EXPO_PUBLIC_GUEST_PASSWORD || "guest",
        });
    }

    storeDatas({ data: accountData, token: "guest_token" });
    useAuthStore.getState().setAuthenticated(true);
    useAuthStore.getState().setBooting(false);
};

