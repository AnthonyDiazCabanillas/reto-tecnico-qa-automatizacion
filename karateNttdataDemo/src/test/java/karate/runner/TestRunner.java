package karate.runner;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import net.masterthought.cucumber.Configuration;
import net.masterthought.cucumber.ReportBuilder;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Ejecuta todos los features en paralelo y genera el reporte Cucumber HTML.
 *
 * Por tags:     mvn test -Dkarate.options="--tags @createPet"
 * Por entorno:  mvn test -Dkarate.env=dev
 * Hilos:        mvn test -Dthreads=1
 */
class TestRunner {

    @Test
    void ejecutarPruebas() throws IOException {
        int hilos = Integer.parseInt(System.getProperty("threads", "3"));
        Results results = Runner.path("classpath:resources/features")
                .outputCucumberJson(true)
                .parallel(hilos);
        generarReporteCucumber(results.getReportDir());
        assertEquals(0, results.getFailCount(), results.getErrorMessages());
    }

    private static void generarReporteCucumber(String carpetaReportes) throws IOException {
        List<String> jsons;
        try (Stream<Path> archivos = Files.walk(Paths.get(carpetaReportes))) {
            jsons = archivos.map(Path::toString)
                    .filter(nombre -> nombre.endsWith(".json"))
                    .collect(Collectors.toList());
        }
        if (jsons.isEmpty()) {
            return;
        }
        Configuration config = new Configuration(new File("target"), "Karate - API PetStore y Restful Booker");
        config.addClassifications("Entorno", System.getProperty("karate.env", "dev"));
        config.addClassifications("Java", System.getProperty("java.version"));
        new ReportBuilder(jsons, config).generateReports();
    }
}
