interface FontDefinition {
    family: string;
    path: string;
}


const FONTS:
    readonly FontDefinition[] = [

        {
            family: "Oswald-Bold",
            path: "/assets/main/fonts/Oswald/static/Oswald-Bold.ttf"
        },

        {
            family: "EgyptianSlateBd",
            path: "/assets/main/fonts/egyptian-slate-pro/EgyptianSlateBd.TTF"
        },

        {
            family: "CrimsonPro-Bold",
            path: "/assets/main/fonts/Crimson_Pro/static/CrimsonPro-Bold.ttf"
        },

        {
            family: "CrimsonPro-Italic",
            path: "/assets/main/fonts/Crimson_Pro/static/CrimsonPro-Italic.ttf"
        },

        {
            family: "CrimsonPro-Regular",
            path: "/assets/main/fonts/Crimson_Pro/static/CrimsonPro-Regular.ttf"
        },

        {
            family: "JackCondensed",
            path: "/assets/main/fonts/JackCondensed/JackCondensed.ttf"
        },

        {
            family: "Anek-Kannada SemiCondensed",
            path: "/assets/main/fonts/anek-kannada.semicondensed-extrabold.ttf"
        },

        {
            family: "Anek-Kannada Condensed",
            path: "/assets/main/fonts/anek-kannada.condensed-extrabold.ttf"
        },

        {
            family: "Anek-Kannada Bold",
            path: "/assets/main/fonts/anek-kannada.bold.ttf"
        },

        {
            family: "Old Standard Regular",
            path: "/assets/main/fonts/Old_Standard_TT/OldStandardTT-Regular.ttf"
        },

        {
            family: "Old Standard Bold",
            path: "/assets/main/fonts/Old_Standard_TT/OldStandardTT-Bold.ttf"
        }

    ];


export async function loadFonts():
    Promise<void> {

    await Promise.all(

        FONTS.map(
            async definition => {

                const font =
                    new FontFace(
                        definition.family,
                        `url(${definition.path})`
                    );


                await font.load();

                document.fonts.add(
                    font
                );
            }
        )
    );


    await document.fonts.ready;
}